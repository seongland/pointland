/*
<summary>Convertor coorinates/summary>
*/

#include "../func.hh"
#include "../lib/converter/SPointConvertor.h"

using namespace std;
using namespace Napi;
using namespace stryx;

namespace Converter {
shared_ptr<SPointConvertor> converter = make_shared<SPointConvertor>();

Value convert(const Napi::CallbackInfo &info) {
  /*
  <summary>Round binding function, make round</summary>
  */
  Env env = info.Env();
  Point2d result;
  try {
    Object camType = info[0].As<Object>();
    Object markObj = info[1].As<Object>();
    Array xyz = info[2].As<Array>();

    // Cam Get
    Object eop = Object(env, camType.Get("eop"));
    Object iop = Object(env, camType.Get("iop"));
    Object t = Object(env, eop.Get("t"));
    Object e = Object(env, eop.Get("e"));
    Array pp = Array(env, iop.Get("pp"));
    Array k = Array(env, iop.Get("k"));

    // Cam Transform
    int lensType = Number(env, camType.Get("lens"));
    int distance = Number(env, camType.Get("distance"));

    double camX = Number(env, t.Get("x"));
    double camY = Number(env, t.Get("y"));
    double camZ = Number(env, t.Get("z"));
    double camf = Number(env, iop.Get("f"));
    double camfw = Number(env, iop.Get("fw"));
    double camfh = Number(env, iop.Get("fh"));
    double camfb = Number(env, iop.Get("fb"));
    double camYaw = Number(env, e.Get("yaw"));
    double camRoll = Number(env, e.Get("roll"));
    double camPitch = Number(env, e.Get("pitch"));

    double campp0 = Number(env, pp.Get((int)0));
    double campp1 = Number(env, pp.Get((int)1));
    double camk0 = Number(env, k.Get((int)0));
    double camk1 = Number(env, k.Get((int)1));
    double camk2 = Number(env, k.Get((int)2));
    double camk3 = Number(env, k.Get((int)3));
    double camk4 = Number(env, k.Get((int)4));

    int imgWidth = Number(env, iop.Get("width"));
    int imgHeight = Number(env, iop.Get("height"));

    // Facility Transform
    double facilityX = Number(env, xyz.Get((int)0));
    double facilityY = Number(env, xyz.Get((int)1));
    double facilityZ = Number(env, xyz.Get((int)2));

    // Mark Transform
    double markX = Number(env, markObj.Get("x"));
    double markY = Number(env, markObj.Get("y"));
    double markZ = Number(env, markObj.Get("z"));
    double markRoll = Number(env, markObj.Get("roll"));
    double markPitch = Number(env, markObj.Get("pitch"));
    double markYaw = Number(env, markObj.Get("heading"));

    // Cam Set
    struct Vector camV;
    camV.x = camX;
    camV.y = camY;
    camV.z = camZ;

    struct Euler camE;
    camE.yaw = camYaw;
    camE.roll = camRoll;
    camE.pitch = camPitch;

    struct PoseEuler camEOP;
    camEOP.t = camV;
    camEOP.e = camE;

    struct IOP camIOP;
    camIOP.f_mm = camf;
    camIOP.Fw = camfw;
    camIOP.Fh = camfh;
    camIOP.fb = camfb;
    camIOP.Nw = imgWidth;
    camIOP.Nh = imgHeight;

    camIOP.pp[0] = campp0;
    camIOP.pp[1] = campp1;
    camIOP.k[0] = camk0;
    camIOP.k[1] = camk1;
    camIOP.k[2] = camk2;
    camIOP.k[3] = camk3;
    camIOP.k[4] = camk4;

    struct CameraInfo camInfo;
    camInfo.distance = distance;
    camInfo.lensType = lensType;
    camInfo.iop = camIOP;
    camInfo.eop = camEOP;

    // Mark Set
    struct Vector markV;
    markV.x = markX;
    markV.y = markY;
    markV.z = markZ;

    struct Euler markE;
    markE.yaw = markYaw;
    markE.roll = markRoll;
    markE.pitch = markPitch;

    struct PoseEuler markPE;
    markPE.t = markV;
    markPE.e = markE;

    // Facility Set
    struct Vector facilityV;
    facilityV.x = facilityX;
    facilityV.y = facilityY;
    facilityV.z = facilityZ;

    struct Point facilityP;
    facilityP.p = facilityV;

    // get result
    result = converter.get()->xyzToImageCoor(camInfo, markPE, facilityP);
  } catch (const Error &e) {
    Error::New(env, e.Message()).ThrowAsJavaScriptException();
  }
  return Boolean::New(env, false);
}
} // namespace Converter
