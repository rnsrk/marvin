// Config
import config from './config/config.json'

// Modules
import createReport from 'docx-templates';
import fs from 'fs';
import { mkdir } from 'node:fs/promises';
import path from 'path';

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
      const template = fs.readFileSync('src/assets/templates/rp-template.docx');
      // Create report.
      buffer = await createReport({
        template,
        data: {
          inventarnummer: objectData.inventarnummer,
          titel: objectData.titel,
          hersteller: objectData.hersteller,
          herstellungsort: objectData.herstellungsort,
          herstellungsdatum: objectData.herstellungsdatum,
          materialTechnik: objectData.materialTechnik,
          masse: objectData.masse
        }
      });
    } catch (err) {
      log = {
        ...log,
        status: 'red',
        message: 'Konnte Template nicht öffnen: ' + err,
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
        status: 'green',
        message: 'Konnte den Pfad nicht erstellen' + err,
        tip: 'Bestehen Schreibrechte auf dem Ordner?'
      }
    }
    // Write document to disk.
    if (buffer) {
      fs.writeFileSync(path.join(folderPath, 'report.docx'), buffer)
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
