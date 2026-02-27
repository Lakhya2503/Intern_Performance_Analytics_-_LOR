
export const castValue = (value, type) => {
        if(value === NaN || value === undefined) return value

          switch(type) {
             case "number" :
                const num = Number(value);
                return Number.isNaN(num) ? null : num;

              case "date":
                const date = new Date(value);
                return isNaN(date.getTime()) ? null : date;

                case "boolean" :
                return value === true || value === "true";

                case "string" :
                return String(value).trim()
          }
     }


export const getChangeFiled = ((oldObj, newObj, internFiledInum) => {
        const changes = {};

        for(const key in internFiledInum) {
            if(key === "_id") continue;
            if(!(key in newObj)) continue

            const type = internFiledInum[key]

            const newValue = castValue(newObj[key], type)
            const oldValue = castValue(oldObj[key], type)


            if(newValue !== oldValue) {
                changes[key] = newValue
            }

          }

          return changes;
 })

export const  scoreCalculation = (score) => {

  const rank =  score;


    



    return {
        rank
    }
}
