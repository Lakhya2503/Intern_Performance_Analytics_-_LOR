
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

export const getChangeField = (oldObj, newObj, internFieldType) => {
    const changes = {};

    for(const key in internFieldType) {
        if(key === "_id") continue;
        if(!(key in newObj)) continue;

        const type = internFieldType[key];
        const newValue = castValue(newObj[key], type);
        const oldValue = castValue(oldObj[key], type);

        console.log("newValue", newValue);
        console.log("oldValue", oldValue);


        if(type === "date") {
            if((newValue?.getTime() || null) !== (oldValue?.getTime() || null)) {
                changes[key] = newValue;
            }
        } else if(newValue !== oldValue) {
            changes[key] = newValue;
        }
    }

    return changes;
}


 export const calculateAverageScore = (intern) => {
    const {
        taskCompletion = 0,
        taskQuality = 0,
        deadlineAdherence = 0,
        attendance = 0,
        mentorFeedback = 0,
        communication = 0,
    } = intern

    return (
        Number(taskCompletion) +
        Number(taskQuality) +
        Number(deadlineAdherence) +
        Number(attendance) +
        Number(mentorFeedback) +
        Number(communication)
    ) / 6
 };

export const approveVerify = (status) =>{
          let approvestatus;
           if( status === "" || status === null || status === undefined ) {
            approvestatus = true;
          } else if( status === "true" || status === true || status === 1 || status === "1" ) {
            approvestatus = true;
          } else if (status === "false" || status === false || status === 0 || status === "0") {
            approvestatus = false
          } else {
            approvestatus = undefined;
          }

          return approvestatus
}
