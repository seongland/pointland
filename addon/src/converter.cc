/*
<summary>Convertor coorinates/summary>
*/

#include "../func.hh"
#include "../lib/converter/SPointConvertor.h"

using namespace std;
using namespace Napi;
extern string root;

namespace Converter {

Napi::Value convert(const Napi::CallbackInfo &info) {
  /*
  <summary>Round binding function, make round</summary>
  */
  Env env = info.Env();
  Array sensors = info[0].As<Array>();
  try {
  } catch (const Error &e) {
    Error::New(env, e.Message()).ThrowAsJavaScriptException();
  }
  return Boolean::New(env, false);
}
}

}
