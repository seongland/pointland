/*
<summary>function can be called from js</summary>
*/
#pragma once

#include <deque>
#include <iostream>
#include <napi.h>
#include <string>
#include <vector>

namespace Converter {
Napi::Value convert(const Napi::CallbackInfo &info);
} // namespace Convert
