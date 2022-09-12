
import { AES, enc } from "crypto-js"

class checksecurity {

    public check = (data: any) => {
        try {
            var token = AES.decrypt(data, '@$toro^ambiator-epit').toString(enc.Utf8);
            console.log(token);

            var splitedtoken = token.split("--split_at_epit--");
            console.log(splitedtoken);

            var token = splitedtoken[0];
            var date = Date.parse(splitedtoken[1]);
            if (token && date) {

                return { "code": 200 }
            } else {
                return { "code": 404, "error": "Improper access" }
            }
        } catch (error) {
            return { "code": 404, "error": error }
        }
    }

}

export default checksecurity
