// Modules
import createReport from 'docx-templates';
import {mkdir} from 'node:fs/promises';
import path from 'path';
import replaceSpecialCharacters from "replace-special-characters";

import {parseString, Builder} from 'xml2js';
import {FileLoader} from "./FileLoader";


////////////////////
//      Main      //
////////////////////

class DocCreator {
  constructor(log, objectData) {

    // Assign Log.
    this.log = log;

    // Assign general object data.
    this.objectData = objectData;

    // Get DateTime.
    this.today = new Date();

    // FileLoader
    this.fileLoader = new FileLoader()

    // Get config file and parse to json.
    this.configFile = this.fileLoader.getConfigFile()

    // Choose the template for selected document type.
    switch (objectData.dokumenttyp) {
      case 'rp':
        this.documentInfo = {
          documentType: 'restaurierungsprotokolle', docTypeAbbr: 'rp', templateFile: 'rp-template.docx',
        }
        break;
      case 'lbb':
        this.documentInfo = {
          documentType: 'leihgabenbegleitblaetter', docTypeAbbr: 'lbb', templateFile: 'lbb-template.docx',
        }
        break;
      case 'a':
        this.documentInfo = {
          documentType: 'analysen', docTypeAbbr: 'a', templateFile: 'a-template.docx',
        }
        break;
    }

    // ObjectId normalisation.
    const normCharacterObjectId = replaceSpecialCharacters(objectData.inventarnummer);
    this.normObjectId = normCharacterObjectId.replace("__", "_");

    // Title normalisation
    const replaceEszettTitle = objectData.titel.replace("ß", "-ss-");
    let replaceUmlauteTitle = replaceEszettTitle.replace("Ä", "Ae");
    replaceUmlauteTitle = replaceUmlauteTitle.replace("ä", "ae");
    replaceUmlauteTitle = replaceUmlauteTitle.replace("Ö", "Oe");
    replaceUmlauteTitle = replaceUmlauteTitle.replace("ö", "oe");
    replaceUmlauteTitle = replaceUmlauteTitle.replace("Ü", "Ue");
    replaceUmlauteTitle = replaceUmlauteTitle.replace("ü", "ue");
    const normCharacterTitle = replaceSpecialCharacters(replaceUmlauteTitle);
    const normSingleSpaceTitle = normCharacterTitle.replace("__", "_");
    const normSpacingTitle = normSingleSpaceTitle.replace(/[^A-Z0-9\-]+/ig, "_");
    this.normTitle = normSpacingTitle.slice(0, 50);

    const folderName = this.normObjectId + '__' + this.normTitle

    this.objectPath = path.join(this.configFile.rootDir, folderName);

    this.documentPath = path.join(this.objectPath, this.documentInfo.documentType, objectData.datum);
    this.filename = this.normObjectId + '__' + this.normTitle + '__' + this.objectData.datum + '__' + this.objectData.dokumenttyp;
    this.filenameWithExtension = this.filename + '.docx'
    this.temporaryWorkDirPath = path.join(this.objectPath, 'werkstatt');


  }

// Fills the docx template.
  async fillTemplate() {
    // Variables
    let buffer;

    // Create docx document if there was a response.
    if (this.objectData.httpStatus === 200) {
      try {
        // Read template.
        const template = fs.readFileSync(path.resolve(this.fileLoader.getTemplateDir(), this.documentInfo.templateFile));

        // Create report.
        buffer = await createReport({
          template, data: {
            inventarnummer: this.objectData.inventarnummer ? this.objectData.inventarnummer : 'unbekannt',
            titel: this.objectData.titel ? this.objectData.titel : 'unbekannt',
            hersteller: this.objectData.hersteller ? this.objectData.hersteller : 'unbekannt',
            herstellungsort: this.objectData.herstellungsort ? this.objectData.herstellungsort : 'unbekannt',
            herstellungsdatum: this.objectData.herstellungsdatum ? this.objectData.herstellungsdatum : 'unbekannt',
            materialTechnik: this.objectData.materialTechnik ? this.objectData.materialTechnik : 'unbekannt',
            masse: this.objectData.masse ? this.objectData.masse : 'unbekannt'
          }
        });
      } catch (err) {
        // Set error log.
        this.log = {
          ...this.log,
          status: 'red',
          message: 'Konnte Template nicht erstellen: ' + err,
          tip: 'Ist das Template vorhanden?',
        };
        return this.log
      }

      try {
        await mkdir(this.documentPath, {recursive: true});
        await mkdir(this.temporaryWorkDirPath, {recursive: true});
      } catch (err) {
        // Set error log.
        this.log = {
          ...this.log,
          status: 'red',
          message: 'Konnte den Pfad nicht erstellen' + err,
          tip: 'Bestehen Schreibrechte auf dem Ordner?'
        }
        return this.log
      }

      // Write document to disk.
      if (buffer) {
        fs.writeFileSync(path.join(this.documentPath, this.filenameWithExtension), buffer)
        this.log = {
          ...this.log, status: 'green', message: 'Dokument erstellt',
        };
      }

    } else {
      this.log = {
        status: 'red',
        message: 'Fehler bei der Kommunikation mit dem Objektkatalog',
        code: this.objectData.httpStatus,
        tip: 'Ist die Inventarnummer richtig?',
      };
    }
    return this.log;
  }

  async createMetsMods() {

    const metsModsString = `
        <mets:mets
          xmlns:mets="http://www.loc.gov/METS/"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          >
          <mets:metsHdr createDate="${this.today}">
            <mets:agent
                type="other"
                otherType="software"
                role="creator">
                <mets:name>
                    ${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}
                    </mets:name>
            </mets:agent>
          </mets:metsHdr>
          <mets:fileSec>
            <mets:fileGrp use="${this.documentInfo.documentType}">
              <mets:file id="file__${this.filename}" mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                <mets:FLocat locType="other" otherLocType="file" xlink:href="${this.filenameWithExtension}"/>
              </mets:file>
            </mets:fileGrp>
          </mets:fileSec>
          <mets:structMap type="physical">
            <mets:div type="${this.documentInfo.docTypeAbbr}" id="phys_00" dmdid="dmdphys_00">
              <mets:fptr fileId="file__${this.filename}"/>
            </mets:div>
          </mets:structMap>
          <mets:structMap type="logical">
            <mets:div type="${this.documentInfo.docTypeAbbr}" id="phys_00">
              <mets:fptr fileId="file__${this.filename}"/>
            </mets:div>
          </mets:structMap>
          <mets:dmdSec id="dmdlog_00">
            <mets:mdWrap mdType="mods">
              <mets:xmlData>
                <mods:mods xmlns:mods="http://www.loc.gov/mods/v3">
                  <mods:recordInfo>
                    <mods:recordIdentifier source="https://objektkatalag.gnm.de">${this.objectData.inventarnummer}</mods:recordIdentifier>
                  </mods:recordInfo>
                  <mods:titleInfo>
                    <mods:title>${this.objectData.titel}</mods:title>
                  </mods:titleInfo>
                  <mods:originInfo>
                    <mods_dateIssued encoding="w3cdtf" keyDate="yes">${this.objectData.herstellungsdatum}</mods_dateIssued>
                    <mods:place>
                      <mods:placeTerm type="text">${this.objectData.herstellungsort}</mods:placeTerm>
                    </mods:place>
                  </mods:originInfo>
                  <mods:name type="personal">
                    <mods:role>
                      <mods:roleTerm authority="marcrelator" type="code">cre</mods:roleTerm>
                    </mods:role>
                    <mods:namePart>${this.objectData.herstellungsort}</mods:namePart>
                    <mods:displayForm>${this.objectData.herstellungsort}</mods:displayForm>
                  </mods:name>
                  <mods:physicalDescription>
                    <mods:form type="Material and Technique" lang="de"/>
                    <mods:extent>${this.objectData.masse}</mods:extent>
                  </mods:physicalDescription>
                </mods:mods>
              </mets:xmlData>
            </mets:mdWrap>
          </mets:dmdSec>
        </mets:mets>
    `

    const metModsJson = {
      'mets:mets': {
        $: {
          'xmlns:mets': "http://www.loc.gov/METS/",
          'xmlns:xlink': "http://www.w3.org/1999/xlink",
          'xmlns:xsi': "http://www.w3.org/2001/XMLSchema-instance",
          'xsi:schemaLocation': "info:lc/xmlns/premis-v2 http://www.loc.gov/standards/premis/v2/premis-v2-0.xsd " +
            "http://www.loc.gov/mods/v3 http://www.loc.gov/standards/mods/v3/mods-3-6.xsd " +
            "http://www.loc.gov/METS/ http://www.loc.gov/standards/mets/version17/mets.v1-7.xsd " +
            "http://www.loc.gov/mix/v10 http://www.loc.gov/standards/mix/mix10/mix10.xsd"
        },
        'mets:metsHdr': {
          $: {
            // Creation date of the mets/mods xml.
            'createDate': this.today // Should be w3ctdf format: YYYY-MM-DDThh:mm:ssTZD
          },
          'mets:agent': {
            // App, which created the xml document
            $: {
              'type': 'other',
              'otherType': 'software',
              'role': 'creator'
            },
            'mets:name': {
              // App name and version
              _: `${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`
            }
          }
        },
        'mets:fileSec': {
          'mets:fielGrp': {
            $: {
              // Documenttype
              'use': `${this.documentInfo.documentType}`
            },
            'mets:file': {
              // Phyical file
              $: {
                'id': `file__${this.filename}`,
                'mimeType': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              },
              'mets:FLocat': {
                // Physical location - here in same folder
                $: {
                  'locType': 'other',
                  'otherLocType': 'file',
                  'xlink:href': `${this.filenameWithExtension}`
                }
              }
            }
          }
        },
        'mets:structMap': [
          { // These are solo documents only, this may be inappropriate.
            $: {
              // Physical structure.
              'type': 'physical'
            },
            'mets:div': {
              $: {
                // Documenttype and id.
                'type': `${this.documentInfo.docTypeAbbr}`,
                // since we have only one document, id and dmdid are static.
                'id': `phys_00`,
                'dmdid': 'dmdphys_00'
              },
              'mets:fptr': {
                $: {
                  // File id from above
                  'fileId': `file__${this.filename}`
                }
              }
            }
          },
          { // These are solo documents only, this may be inappropriate.
            $: {
              // Physical structure.
              'type': 'logical'
            },
            'mets:div': {
              $: {
                // Documenttype and id.
                'type': `${this.documentInfo.docTypeAbbr}`,
                // since we have only one document, id and dmdid are static.
                'id': `phys_00`,
                'dmdid': 'dmdphys_00'
              },
              'mets:fptr': {
                $: {
                  // File id from above
                  'fileId': `file__${this.filename}`
                }
              }
            }
          }],
        'mets:dmdSec':
          {
            $: {
              // Since we have only one document, dmdlog is static
              'id':
                `dmdlog_00`
            }
            ,
            'mets:mdWrap':
              {
                $: {
                  'mdType':
                    'mods'
                }
                ,
                'mets:xmlData':
                  {
                    'mods:mods':
                      {
                        // Object properties as found at https://objektkatalog.gnm.de.
                        $: {
                          'xmlns:mods':
                            'http://www.loc.gov/mods/v3'
                        }
                        ,
                        'mods:recordInfo':
                          {
                            'mods:recordIdentifier':
                              {
                                // ObjectId.
                                $: {
                                  'source':
                                    'https://objektkatalag.gnm.de'
                                }
                                ,
                                _: `${this.objectData.inventarnummer}`
                              }
                          }
                        ,
                        'mods:titleInfo':
                          {
                            // Title.
                            'mods:title':
                              {
                                _: `${this.objectData.titel}`
                              }
                          }
                        ,
                        'mods:originInfo':
                          {
                            // Creation date.
                            'mods_dateIssued':
                              {
                                $: {
                                  'encoding':
                                    'w3cdtf', // W3C Date and Time, should be YYYY-MM-DDThh:mm:ssTZD
                                  'keyDate':
                                    'yes'
                                }
                                ,
                                _: `${this.objectData.herstellungsdatum}`
                              }
                            ,
                            'mods:place':
                              {
                                // Creation place
                                'mods:placeTerm':
                                  {
                                    $: {
                                      'type':
                                        'text'
                                    }
                                    ,
                                    _: `${this.objectData.herstellungsort}`
                                  }
                              }
                          }
                        ,
                        'mods:name':
                          {
                            // Creator.
                            $: {
                              'type':
                                'personal'
                            }
                            ,
                            'mods:role':
                              {
                                'mods:roleTerm':
                                  {
                                    $: {
                                      'authority':
                                        'marcrelator',
                                      'type':
                                        'code'
                                    }
                                    ,
                                    _: 'cre'
                                  }
                              }
                            ,
                            'mods:namePart':
                              {
                                _: this.objectData.hersteller
                              }
                            ,
                            'mods:displayForm':
                              {
                                _: this.objectData.hersteller
                              }
                          }
                        ,
                        'mods:physicalDescription':
                          {
                            'mods:form':
                              {
                                $: {
                                  'type':
                                    'Material and Technique',
                                  'lang':
                                    'de'
                                }
                              }
                            ,
                            'mods:extent':
                              {
                                _: `${this.objectData.masse}`
                              }
                          }
                      }
                  }
              }
          }
      }
    }

    let metModsXml
    parseString(metsModsString, {trim: true},
      function (err, result) {
        metModsXml = result;
      }
    );

    const builder = new Builder()
    metModsXml = builder.buildObject(metModsJson);

    const fileName = `.metsMods__${this.normObjectId}__${this.normTitle}.xml`
    fs.writeFileSync(path.join(this.documentPath,fileName),metModsXml.toString(),
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("The file was saved!");
          }
        }
      )
    return true;
  }
}

export {DocCreator};
