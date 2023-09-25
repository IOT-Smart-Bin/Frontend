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
        axiosInstance.get(`/binData/${bid}`),
        axiosInstance.get(`/binHistory`, { params: { startDate: startDate, bid: bid }})
    ]).then(([
        binDataResponse, 
        binHistoryResponse]) => 
    {
        /**
         * @type {BinData}
         */
        const binData = binDataResponse.data
        /**
         * @type {BinHistory[]}
         */
        const binHistory = binHistoryResponse.data
        
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
    const responseBody = {
        bid, name, tags, lat, long, pictureLink
    }
    return axiosInstance.post("/edit", responseBody)
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
     .post("/mapData", {
       bids: bids,
     })
     .then((mapDataResponse) => {
       return mapDataResponse.data.map((mapData) => ({
         bid: mapData.bid,
         lat: parseFloat(mapData.lat),
         lng: parseFloat(mapData.long),
       }));
     })
     .then((mapDataResponse) => {
       return mapDataResponse;
     }); 
}
