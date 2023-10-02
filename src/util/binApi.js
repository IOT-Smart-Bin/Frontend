import axiosInstance from "./axiosInstance"
import QueryString from "qs"

/**
 * @typedef BinHistory
 * @property {number} gas
 * @property {number} weight
 * @property {number} timestamp
 * @property {number} humidityInside 
 * @property {number} humidityOutside
 * @property {number} capacity
 * @property {number} temperature
 * 
 * @typedef BinData
 * @property {string} bid
 * @property {string[]} tags
 * @property {string} pictureLink
 * @property {string} name
 * @property {Object} location
 * @property {string} location.lat
 * @property {string} location.long
 * 
 * @typedef Timeline
 * @property {BinHistory[]} history
 */

/**
 * 
 * @param {string} bid 
 * @param {string} startDate 
 * @returns {BinData & Timeline}
 */
export const getBinDataAndHistory = (bid, startDate) => {
    return Promise.all([
        axiosInstance.post(`/bins`, [parseInt(bid)]),
        axiosInstance.post(`/histories`, { start_date: startDate, bid: parseInt(bid) })
    ]).then(([
        binDataResponse, 
        binHistoryResponse]) => 
    {
        if (binDataResponse.data.length === 0) throw new Error("No Data")
        const dataOfInterest = binDataResponse.data[0]
        /**
         * @type {BinData}
         */
        const binData = {
          bid: dataOfInterest.bid.toString(),
          tags: dataOfInterest.tags, 
          pictureLink: dataOfInterest.image,
          name: dataOfInterest.name,
          location: {
            lat: dataOfInterest.location && dataOfInterest.location.latitude ? dataOfInterest.location.latitude.toString() : -200,
            long: dataOfInterest.location && dataOfInterest.location.longitude ? dataOfInterest.location.longitude.toString() : -200
          }
        }
        /**
         * @type {BinHistory[]}
         */
        const binHistory = binHistoryResponse.data.map((dataPoint) => {
          return {
            timestamp: dataPoint.timestamp,
            gas: dataPoint.gas,
            weight: dataPoint.weight,
            capacity: dataPoint.capacity > 0 ? dataPoint.capacity : 0,
            humidityInside: dataPoint.humidity_inside,
            humidityOutside: dataPoint.humidity_outside,
            temperature: dataPoint.temperature
          }
        })
        
        // data preprocessor here - name change, etc.
        return {...binData, history: binHistory}  
    })
}

/**
 * @typedef EditableData
 * @property {string} bid 
 * @property {string} name
 * @property {string[]} tags
 * @property {string} lat
 * @property {string} long
 * @property {string} pictureLink
 */

export const editBinData = (bid, name, tags, lat, long, pictureLink) => {
    const dataReqBody = {
        bid: parseInt(bid), 
        name: name, 
        tags: tags.length > 0 ? tags : null, 
        location: {
          latitude: parseFloat(lat),
          longitude: parseFloat(long)
        },
    }

    if (!pictureLink) {
      return axiosInstance.put("/bin_info", dataReqBody);
    }

    const imageReqbody = {
      bid: parseInt(bid),
      image: pictureLink,
    }

    return Promise.all([
      axiosInstance.put("/bin_info", dataReqBody),
      axiosInstance.put("/image", imageReqbody)
    ]) 
}

/**
 * @typedef MapData
 * @property {string} bid
 * @property {string} lat
 * @property {string} lng
 * 
 * @param {string[]} bids 
 * @returns {Promise<MapData[]>}
 */
export const getMapData = (bids) => {
   return axiosInstance
     .post("/locations", 
       bids.map((bid) => parseInt(bid)),
     )
     .then((mapDataResponse) => {
       return mapDataResponse.data.map((mapData) => ({
         bid: mapData.bid.toString(),
         name: mapData.name,
         tags: mapData.tags,
         lat: parseFloat(mapData.location && mapData.location.latitude ? mapData.location.latitude : -200),
         lng: parseFloat(mapData.location && mapData.location.longitude ? mapData.location.longitude : -200),
       }));
     })
}
