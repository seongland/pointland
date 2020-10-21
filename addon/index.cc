/*
 * <summary>index file from js</summary>
 */

#include "func.hh"

using namespace Napi;

Object RegisterConvertor(Env env, Object exports) {
  Object Converter = Napi::Object::New(env);
  Lidar.Set("init", Function::New(env, Converter::convert));
  return Converter;
}

Object Register(Env env, Object exports) {
  /*
   * <summary>Function Register Method</summary>
   */
  exports.Set("Converter", RegisterConvertor(env, exports));
  return exports;
}

NODE_API_MODULE(hardware, Register)
