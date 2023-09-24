import axiosInstance from "./axiosInstance"

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
 * @property {string} name
 * @property {string[]} tags
 * @property {string} lat
 * @property {string} long
 * @property {string} pictureLink
 */

export const editBinData = (name, tags, lat, long, pictureLink) => {
    const responseBody = {
        name, tags, lat, long, pictureLink
    }
    return axiosInstance.post("/edit", responseBody)
}
