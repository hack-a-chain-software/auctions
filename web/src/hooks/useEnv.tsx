export const useEnv: (name: string) => string = (name: string) => {
  if(import.meta.env[import.meta.envPrefix+name])
    return import.meta.env[import.meta.envPrefix+name];
  if(import.meta.env[name])
    return import.meta.env[name];
  throw new Error(`Environment variable ${name} is not defined.`);
}