
export class FormUtil {
    constructor(){}

    trimAllValues(values: any): any {
        Object.keys(values).forEach(key => {
          if (typeof(values[key]) === 'string') {
            values[key] = values[key].trim();
          }
        });
        return values;
    }

    toJsonKeyValue(v: any): {} {
      const values: {[key: string]: any} = {};

      Object.keys(v).forEach(index => {
        if (!(v[index].value === null || v[index].value === '')) {
          values[v[index].key] = v[index].value;
        }
      });
      return values;
    }
}
