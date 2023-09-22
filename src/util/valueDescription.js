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
 * @property {Interpretor[]} interpretor
 */
/**
 * Classname used in the component after interpretation
 * @typedef Assets
 * @property {string} textColor
 * @property {string} borderColor
 */
/**
 * Component config that relies on the interpretation of the measured value
 * @typedef ComponentConfig
 * @property {string} description
 * @property {string} unit
 * @property {Interpretor} interpreted
 * @property {Assets} asset
 */

/**
 * @type {ValueConfig[]}
 */
export const valueConfig = [
  {
    valueName: "humidity",
    description:
      "The amount of water in the air, could affect how fast microbial can grow",
    unit: "ppm",
    interpretor: [
        {
            lowerBound: 500,
            interpretAs: "Danger",
            interpretDescription: "Seek shelter",
            displayColorLevel: 3,
        },
        {
            lowerBound: 300,
            interpretAs: "Intermediate",
            interpretDescription: "",
            displayColorLevel: 2,
        },
        {
            lowerBound: 0,
            interpretAs: "Safe",
            interpretDescription: "",
            displayColorLevel: 1,
        },
    ]
  },
  {
    valueName: "capacity",
    description:
      "The amount of trash in the bin, if the bin is full then no one can use it and people would litter",
    unit: "ppm",
    interpretor: []
  },
  {
    valueName: "weight",
    description:
      "How heavy the trash is. If the trash is heavy, it could be harder to pick up. Make sure to bring " +
      "the right equipment when picking up heavy trash. Heavy trash could also indicate the amount of water content in the trash",
    unit: "ppm",
    interpretor: []
  },
  {
    valueName: "gas",
    description: "High gas concentration could lead to smell, and other health related hazard",
    unit: "ppm",
    interpretor: []
  },
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
            borderColor: ""
        }
        case 1: 
        return {
            textColor: "text-success",
            borderColor: "border-success"
        }
        case 2: 
        return {
            textColor: "text-warning",
            borderColor: "border-warning"
        }
        case 3: 
        return {
            textColor: "text-danger",
            borderColor: "border-danger"
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
      interpreted: interpretorInstance,
      asset: assetGenerator(interpretorInstance.displayColorLevel),
    }
  }

  return {
    unit: "Unit",
    description: "No Description for this item",
    interpreted: {
      lowerBound: -1,
      interpretAs: "No info",
      interpretDescription: "No info",
      displayColorLevel: 0,
    },
    asset: assetGenerator(0)
  }
}
