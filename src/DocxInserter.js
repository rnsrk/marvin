// Modules
import createReport from 'docx-templates';
import fs from 'fs';
import { mkdir } from 'node:fs/promises';
import path from 'path';
import replaceSpecialCharacters from "replace-special-characters";


////////////////////
//      Main      //
////////////////////

// Fills the docx template.
export async function fillTemplate(log, objectData) {
  // Variables
  let buffer;
  let configJson

  // Create docx document if there was a response.
  if (objectData.httpStatus === 200) {
    let documentInfo;
    try {
      // Load config file.
      let ConfigFile = fs.readFileSync('resources/config/config.json')
      configJson = JSON.parse(ConfigFile)

      // Choose the template for selected document type.
      switch (objectData.dokumenttyp) {
        case 'rp':
          documentInfo = {
            documentType: 'restaurierungsprotokolle',
            templateFile: 'rp-template.docx',
          }
          break;
        case 'lbb':
          documentInfo = {
            documentType: 'leihgabenbegleitblaetter',
            templateFile: 'lbb-template.docx',
          }
          break;
        case 'a':
          documentInfo = {
            documentType: 'analysen',
            templateFile: 'a-template.docx',
          }
          break;
      }
      // Read template.
      const template = fs.readFileSync(path.join('resources/templates/', documentInfo.templateFile));

      // Create report.
      buffer = await createReport({
        template,
        data: {
          inventarnummer: objectData.inventarnummer ? objectData.inventarnummer : 'unbekannt' ,
          titel: objectData.titel ? objectData.titel : 'unbekannt',
          hersteller: objectData.hersteller ? objectData.hersteller : 'unbekannt',
          herstellungsort: objectData.herstellungsort ? objectData.herstellungsort : 'unbekannt',
          herstellungsdatum: objectData.herstellungsdatum ? objectData.herstellungsdatum : 'unbekannt',
          materialTechnik: objectData.materialTechnik ? objectData.materialTechnik : 'unbekannt' ,
          masse: objectData.masse ? objectData.masse : 'unbekannt'
        }
      });
    } catch (err) {
      // Set error log.
      log = {
        ...log,
        status: 'red',
        message: 'Konnte Template nicht erstellen: ' + err,
        tip: 'Ist das Template vorhanden?',
      };
      return log
    }

    // Create folder (if necessary).
    const objectPath = path.join(configJson.rootDir, objectData.inventarnummer);
    const documentPath = path.join(objectPath, documentInfo.documentType);
    const temporaryWorkDirPath = path.join(objectPath, 'werkstatt');
    try {
      const createDocumentPath = await mkdir(documentPath, {recursive: true});
      const createTemporaryWorkDirPath = await mkdir(temporaryWorkDirPath, {recursive: true});
    } catch (err) {
      // Set error log.
      log = {
        ...log,
        status: 'red',
        message: 'Konnte den Pfad nicht erstellen' + err,
        tip: 'Bestehen Schreibrechte auf dem Ordner?'
      }
      return log
    }

    // Write document to disk.
    if (buffer) {
      const normCharacterTitle = replaceSpecialCharacters(objectData.titel)
      const normSpacingTitle = normCharacterTitle.replace(/[^A-Z0-9]+/ig, "_");
      const filename = objectData.datum + '_' + normSpacingTitle + '.docx'
      fs.writeFileSync(path.join(documentPath, filename), buffer)
      log = {
        ...log,
        status: 'green',
        message: 'Dokument erstellt',
      };
    }

  } else {
    log = {
      status: 'red',
      message: 'Fehler bei der Kommunikation mit dem Objektkatalog',
      code: objectData.httpStatus,
      tip: 'Ist die Inventarnummer richtig?',
    };
  }
  return log;
}
