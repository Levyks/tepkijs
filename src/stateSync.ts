export const shadow_state = {};

type PathKey = string | [string, 'array'];

function createSchema(schema: any, key: PathKey) {
  if(!(key instanceof Array)) {
    schema[key] = {};
    return;
  }

  switch(key[1]) {
    case 'array':
      schema[key[0]] = [];
      break;
    default:
      throw new Error(`Unknown schema type ${key[1]}`);
  }
}

function getRealKey(key: PathKey) {
  return key instanceof Array ? key[0] : key;
}

export function syncState(paths: Array<PathKey>, value: any) {

  console.log('setting', paths, 'to',value);

  let schema = shadow_state;
  
  for(let i = 0; i < paths.length - 1; i++) {
    const key = paths[i];

    const real_key = getRealKey(key);
  
    if(!schema[real_key]) {
      createSchema(schema, key);
    }
    schema = schema[real_key];

  }

  schema[getRealKey(paths[paths.length - 1])] = value;


  console.log(JSON.stringify(shadow_state, null, 2), "\n-----------------\n");

}