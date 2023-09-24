/**
 * returns all the bids in local storage as string array
 * @returns {string[]}
 */
export const readBID = () => {
  const allBIDString = localStorage.getItem("binID");
  if (!allBIDString) return [];

  const allBID = JSON.parse(allBIDString);
  return allBID;
};

/**
 * write BID string array to localstorage in string form
 * @param {string[]} allBID 
 */
export const writeBID = (allBID) => {
    const allBIDString = JSON.stringify(allBID);
    localStorage.setItem("binID", allBIDString);
}

/**
 * add the new BID to local storage
 * return the new list of all the bid, including the new one
 * @param {string} newBID 
 * @returns {string[]} 
 */
export const addBID = (newBID) => {
    const allBID = readBID();
    allBID.push(newBID);
    writeBID(allBID);
    return allBID;
}

/**
 * remove a bid from local storage array
 * returns the new bid array
 * @param {string} bid 
 * @returns {string[]}
 */
export const removeBID = (bid) => {
    let allBID = readBID();
    allBID = allBID.filter((biditem) => biditem !== bid);
    writeBID(allBID)
    return allBID;
}

/**
 * @param {string} bid
 * @returns {boolean}
 */
export const isInWatchList = (bid) => {
    const allBID = readBID();    
    return allBID.includes(bid)
}