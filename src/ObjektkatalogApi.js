const {parseString} = require("xml2js");

/*
 *  Properties and functions for communication with Objektkatalog-API.
 */
class ObjektkatalogApi {

  // Variables
  json;
  raw;
  receivedData = {
    datum: '',
    hersteller: '',
    herstellungsdatum: '',
    herstellungsort: '',
    httpStatus: 500,
    inventarnummer: '',
    masse: '',
    materialTechnik: '',
    titel: '',
    wisskiUri: '',
  };
  response;
  visibility;


  // Get data from objektkatalog.gnm.de.

  async getData(objectId) {
    if (objectId) {
      // RESTful GET.
      this.response = await fetch('https://objektkatalog.gnm.de/rest_export/' + objectId).then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Bad response from server: " + response.status);
        }
        return response;
      }).then((returnedResponse) => {
        // Everything went well.
        return returnedResponse
      }).catch((error) => {
        // Error while fetch.
        return {status: 503};
      });

      switch (this.response.status) {
        case 200:
          // Parse to json.
          const responseJson = await this.response.json(); //extract JSON from the http response
          if (responseJson.length !== 0) {
            // Json with raw data (LIDO inside!)
            this.raw = {
              eid: responseJson[0]['eid'],
              allgemeineBezeichnung: responseJson[0]['fc6392714594e73ddb2fa363815a8fdf'],
              beschreibung: responseJson[0]['f81f557caccf45074edfb65ff077011f'],
              bilder: responseJson[0]['f41dae62df47283958f605716d141ebf'],
              darstellung: responseJson[0]['f217e1053b1e29411d4b00f3b1e1d52b'],
              erwerbsmethode: responseJson[0]['fa4aa035d411275cd36a2fbb5c159a2c'],
              fruehstes: responseJson[0]['ff4a178095c895a12fce6320c04ba0b0'],
              fundort: responseJson[0]['f1c2bf9f6f3d78302bbfa9cc8b3e439c'],
              gehoertZuAggregation: responseJson[0]['fca2cff9e713e02b93be1f9f19dff88e'],
              herstellerString: responseJson[0]['f9f9408fdacc1230497c591c89655777'],
              herstellungsdatum: responseJson[0]['fd9f0912229c78d94dd6f807e683d06e'],
              herstellungsort: responseJson[0]['fbbccf2979c1143b0fa25325a849b121'],
              individuelleEinordnung: responseJson[0]['f8e7a568a6a0fb8907b41f5ba8a9cabe'],
              inventarnummer: responseJson[0]['f9830c2c7747a792ebbe1ca2587d1f26'],
              klassifikation: responseJson[0]['fdcd0101d5c77884d185560aa7521645'],
              masse: responseJson[0]['ffdac65ffbb12438e2fef5b26533c909'],
              materialTechnik: responseJson[0]['f23b67bd18913642fc3936c1f2af5682'],
              muster: responseJson[0]['f88917aeadae224c8d2c1fec35720dc8'],
              provisio: responseJson[0]['f930a6ca774cc5640694c5aa081c1e66'],
              sammlung: responseJson[0]['ffd22ba4399f8d62e61c4e99463dddaa'],
              spaetestens: responseJson[0]['f1c2bf9f6f3d78302bbfa9cc8b3e439c'],
              standort: responseJson[0]['f95e9be48ed110cf4f92298712d364bd'],
              titel: responseJson[0]['f2049b2456b20f8fd80f714e154f1d47'],
              unterbringung: responseJson[0]['f15265e39237868a568ee63453492b17'],
              vitrinentext: responseJson[0]['fe5e3ff18aedf1d25c639dc79fb24ad1'],
              wisskiUri: responseJson[0]['wisski_uri'][0]['value'],
              zustandsbeschreibung: responseJson[0]['f54b6da6006ea444c33a348b8c4370a8']
            }
            break;
          } else {
            // No json, no data form.
            this.receivedData = {
              ...this.receivedData,
              httpStatus: 404,
            }
            this.visibility = false
            return [this.receivedData, this.visibility]
          }
        case 408:
          // No response, no data form.
          this.receivedData = {
            ...this.receivedData,
            httpStatus: 408,
          }
          this.visibility = false
          return [this.receivedData, this.visibility]
        case 503:
          // Objektkatalog not reachable.
          this.receivedData = {
            ...this.receivedData,
            httpStatus: 503,
          }
          this.visibility = false
          return [this.receivedData, this.visibility]
        default:
          // Any other error
          this.receivedData = {
            ...this.receivedData,
            httpStatus: 500,
          }
          this.visibility = false
          return [this.receivedData, this.visibility]
      }
    } else {
      // No ObjectId, no data form.
      this.receivedData = {
        ...this.receivedData,
        httpStatus: 500,
      }
      this.visibility = false
      return [this.receivedData, this.visibility]
    }

    // Bilder
    let bilder  =[];
    if (this.raw.bilder.length !== 0) {
      for (const bildIndex in this.raw.bilder) {
        bilder.push(this.raw.bilder[bildIndex].url)
      }
    } else {
      this.bilder = null;
    }

    // Datum
    // Default date of today
    let today = new Date()
    let todayFormat = today.getFullYear() + '-' + (String(today.getMonth() + 1).padStart(2, '0')) + '-' + String(today.getDate()).padStart(2, '0');
    ;

    // Inventarnummer
    let inventarnummer;
    if (this.raw.inventarnummer.length !== 0) {
      inventarnummer = this.raw.inventarnummer[0].value;
    } else {
      inventarnummer = 'unbekannt';
    }

    // Titel
    let titel;
    if (this.raw.titel.length !== 0) {
      titel = this.raw.titel[0].value;
    } else {
      titel = 'unbekannt';
    }

    // Hersteller (LIDO format!)
    let herstellerArray = [];
    let hersteller;

    if (this.raw.herstellerString.length !== 0) {
      this.raw.herstellerString.forEach((item) => {
        parseString(item.value, (err, result) => {
          herstellerArray.push(result['results']['lido:eventActor'][0]['lido:actorInRole'][0]['lido:actor'][0]['lido:nameActorSet'][0]['lido:appellationValue'][0]['_']);
          return hersteller = herstellerArray.join(';')
        })
      });
    } else {
      hersteller = 'unbekannt';
    }

    // Herstellungsort
    let herstellungsort;
    if (this.raw.herstellungsort.length !== 0) {
      herstellungsort = this.raw.herstellungsort[0].value
    } else {
      herstellungsort = 'unbekannt';
    }

    // Herstellungsdatum
    let herstellungsdatum;
    if (this.raw.herstellungsdatum.length !== 0) {
      herstellungsdatum = this.raw.herstellungsdatum[0].value
    } else {
      herstellungsdatum = 'unbekannt';
    }

    // Material und Technik
    let materialTechnik;
    if (this.raw.materialTechnik.length !== 0) {
      materialTechnik = this.raw.materialTechnik[0].value
    } else {
      materialTechnik = 'unbekannt';
    }

    // Maße (LIDO format!)
    let masse;
    if (this.raw.masse.length !== 0) {
      parseString(this.raw.masse[0].value, (err, result) => {
        return masse = result['results']['lido:objectMeasurementsSet'][0]['lido:displayObjectMeasurements'][0];
      })
    }


    // Json with important data.
    this.receivedData = {
      ...this.receivedData,
      bilder: bilder,
      datum: todayFormat,
      titel: titel,
      hersteller: hersteller,
      herstellungsort: herstellungsort,
      herstellungsdatum: herstellungsdatum,
      inventarnummer: inventarnummer,
      materialTechnik: materialTechnik,
      masse: masse,
      wisskiUri: this.raw.wisskiUri,
      httpStatus: 200,
    }
    this.visibility = true
    return [this.receivedData, this.visibility]
  }
}


module.exports = ObjektkatalogApi;
