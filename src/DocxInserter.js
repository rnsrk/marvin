// Config
import config from '/resources/config/config.json'

// Modules
import createReport from 'docx-templates';
import fs from 'fs';
import { mkdir } from 'node:fs/promises';
import path from 'path';
import replaceSpecialCharacters from "replace-special-characters";

// Components
import ObjektkatalogApi from './ObjektkatalogApi';

////////////////////
//      Main      //
////////////////////

export async function fillTemplate(log, objectData) {
  let buffer;
  // Create docx document.
  if (objectData.httpStatus === 200) {
    try {
      // Read template.
      const template = fs.readFileSync('resources/templates/rp-template.docx');
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
      log = {
        ...log,
        status: 'red',
        message: 'Konnte Template nicht erstellen: ' + err,
        tip: 'Ist das Template vorhanden?',
      };
    }
    const folderPath = path.join(config.rootDir, objectData.inventarnummer);
    // Create Folder if necessary.
    try {
      const createDir = await mkdir(folderPath, {recursive: true});
    } catch (err) {
      log = {
        ...log,
        status: 'red',
        message: 'Konnte den Pfad nicht erstellen' + err,
        tip: 'Bestehen Schreibrechte auf dem Ordner?'
      }
    }
    // Write document to disk.

    if (buffer) {
      const normCharacterTitle = replaceSpecialCharacters(objectData.titel)
      const normSpacingTitle = normCharacterTitle.replace(/[^A-Z0-9]+/ig, "_");
      const filename = objectData.datum + '_' + normSpacingTitle + '.docx'
      fs.writeFileSync(path.join(folderPath, filename), buffer)
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
