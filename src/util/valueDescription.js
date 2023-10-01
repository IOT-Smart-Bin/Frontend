/**
 * Contains the threshold to be interpret and the meaning of interpretation
 * @typedef Interpretor
 * @property {number} lowerBound 
 * @property {string} interpretAs
 * @property {string} interpretDescription
 * @property {0 | 1 | 2 | 3} displayColorLevel 
 */
/**
 * Config for all value that can be interpreted 
 * Warning: Please sort the interpretor by their lowerBound value descending
 * @typedef ValueConfig 
 * @property {string} valueName 
 * @property {string} unit
 * @property {string} description
 * @property {string} displayName 
 * @property {Interpretor[]} interpretor
 */
/**
 * Classname used in the component after interpretation
 * @typedef Assets
 * @property {string} textColor
 * @property {string} borderColor
 * @property {string} background
 */
/**
 * Component config that relies on the interpretation of the measured value
 * @typedef ComponentConfig
 * @property {string} description
 * @property {string} displayName 
 * @property {string} unit
 * @property {Interpretor} interpreted
 * @property {Assets} asset
 */

/**
 * @type {ValueConfig[]}
 */
export const valueConfig = [
  {
    valueName: "humidityInside",
    displayName: "Inside Humidity",
    description:
      "The amount of water in the air inside the bin, could affect how fast microbial can grow",
    unit: "%",
    interpretor: [
      {
        lowerBound: 75,
        interpretAs: "Danger",
        interpretDescription: "High risk of bacterial growth and eminating smell, Please collect your bin",
        displayColorLevel: 3,
      },
      {
        lowerBound: 40,
        interpretAs: "Intermediate",
        interpretDescription: "Higher change of bacterial growth, collect bin if necessary",
        displayColorLevel: 2,
      },
      {
        lowerBound: 0,
        interpretAs: "Safe",
        interpretDescription: "Low chance of bacterial growth",
        displayColorLevel: 1,
      },
    ],
  },
  {
    valueName: "humidityOutside",
    displayName: "Outside Humidity",
    description:
      "The amount of water in the air, could be used to compare with the humidity inside the bin for better information",
    unit: "%",
    interpretor: [
      {
        lowerBound: 0,
        interpretAs: "No interpretation",
        interpretDescription: "This information does not need to be interpreted",
        displayColorLevel: 0,
      },
    ],
  },
  {
    valueName: "capacity",
    displayName: "Capacity",
    description:
      "The amount of trash in the bin, if the bin is full then no one can use it and people would litter",
    unit: "%",
    interpretor: [
      {
        lowerBound: 75,
        interpretAs: "High",
        interpretDescription: "Please collect this bin",
        displayColorLevel: 3,
      },
      {
        lowerBound: 40,
        interpretAs: "Medium",
        interpretDescription: "No need for immediate attention",
        displayColorLevel: 2,
      },
      {
        lowerBound: 0,
        interpretAs: "Safe",
        interpretDescription: "Empty Bin",
        displayColorLevel: 1,
      },
    ],
  },
  {
    valueName: "weight",
    displayName: "Weight",
    description:
      "How heavy the trash is. If the trash is heavy, it could be harder to pick up. Make sure to bring " +
      "the right equipment when picking up heavy trash. Heavy trash could also indicate the amount of water content in the trash",
    unit: "g",
    interpretor: [
      {
        lowerBound: 3000,
        interpretAs: "Heavy",
        interpretDescription: "Heavy bin, Please bring cart when collecting",
        displayColorLevel: 3
      },
      {
        lowerBound: 1000,
        interpretAs: "Mildly heavy",
        interpretDescription: "Mildly heavy bin",
        displayColorLevel: 2
      },
      {
        lowerBound: 0,
        interpretAs: "Light",
        interpretDescription: "The bin is light",
        displayColorLevel: 1
      },
    ],
  },
  {
    valueName: "gas",
    displayName: "Gas",
    description:
      "High gas concentration could lead to smell, and other health related hazard",
    unit: "%",
    interpretor: [
      {
        lowerBound: 500,
        interpretAs: "High",
        interpretDescription: "Could lead to bad smell",
        displayColorLevel: 3
      },
      {
        lowerBound: 300,
        interpretAs: "Medium",
        interpretDescription: "Could start having bad odor",
        displayColorLevel: 2
      },
      {
        lowerBound: 0,
        interpretAs: "Low",
        interpretDescription: "Unlikely to have bad smell",
        displayColorLevel: 1
      },
    ],
  },
  {
    valueName: "temperature",
    displayName: "Temperature",
    description:
      "Can be used to tell how fast the trash could be decomposing",
    unit: "°C",
    interpretor: [
      {
        lowerBound: 36,
        interpretAs: "High",
        interpretDescription: "Trash decompose fast, could increase the frequency of trash collection",
        displayColorLevel: 3
      },
      {
        lowerBound: 30,
        interpretAs: "Low",
        interpretDescription: "Trash decompose faster",
        displayColorLevel: 2
      },
      {
        lowerBound: 0,
        interpretAs: "Low",
        interpretDescription: "Slower for the trash to decompose",
        displayColorLevel: 1
      },
    ],
  },,
];

/**
 * @param {Interpretor[]} interpretors 
 * @param {number} currentValue 
 * @returns {Interpretor}
 */
export const getInterpretation = (interpretors, currentValue) => {
  if (interpretors) {
    for (let interpretorInstance of interpretors) {
      if (interpretorInstance.lowerBound <= currentValue) {
        return interpretorInstance;
      }
    }
  }

  return {
    interpretAs: "No Info",
    interpretDescription: "No interpretation information",
    lowerBound: -1,
    displayColorLevel: 0
  };
}

/**
 * @param {0 | 1 | 2 | 3} level 
 * @returns {Assets} 
 */
export const assetGenerator = (level) => {
    switch (level) {
        case 0: 
        return {
            textColor: "",
            borderColor: "",
            background: ""
        }
        case 1: 
        return {
            textColor: "text-success",
            borderColor: "border-success",
            background: "success-background"
        }
        case 2: 
        return {
            textColor: "text-warning",
            borderColor: "border-warning",
            background: "warning-background"
        }
        case 3: 
        return {
            textColor: "text-danger",
            borderColor: "border-danger",
            background: "danger-background"
        }
    }
}

/**
 * 
 * @param {string} valueName 
 * @param {number} currentValue 
 * @returns {ComponentConfig}
 */
export const getComponentConfigBasedOfMeasuredValue = (valueName, currentValue) => {
  const valueNameConfig = valueConfig.find((value) => value.valueName === valueName);
  if (valueNameConfig) {
    const interpretorInstance = getInterpretation(valueNameConfig.interpretor, currentValue);
    return {
      unit: valueNameConfig.unit,
      description: valueNameConfig.description,
      displayName: valueNameConfig.displayName,
      interpreted: interpretorInstance,
      asset: assetGenerator(interpretorInstance.displayColorLevel),
    }
  }

  return {
    unit: "Unit",
    description: "No Description for this item",
    displayName: valueName,  
    interpreted: {
      lowerBound: -1,
      interpretAs: "No info",
      interpretDescription: "No info",
      displayColorLevel: 0,
    },
    asset: assetGenerator(0)
  }
}
