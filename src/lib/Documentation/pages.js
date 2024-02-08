// duplicate the import line and change the variable name
// then use the path to the md file and then add ?raw
// ex:
//      "./test.md?raw"
//      "./particle-tools.md?raw"

// Rounding+
import PageRoudingPlus from "./Rounding.md?raw";

export default {
    // the key is the path to the docs page
    // so you can do "sharkpool-particle-tools" for example
    // you cant use / like "sharkpool/particle-tools" yet
    "rounding-plus": PageRoudingPlus,
};
