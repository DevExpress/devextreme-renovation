import mocha from "mocha";

if (!mocha.describe) { 
    mocha.describe = describe;
    mocha.it = it;
}

export default mocha;
