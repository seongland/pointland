#define _USE_MATH_DEFINES
#include <cmath>
#ifndef SPOINTCONVERTOR_H
#define SPOINTCONVERTOR_H
#include <iostream>
#include <vector>
#define MAX_SECOND 604800
#define Degree2Radian(degree) (degree * M_PI / 180)
#define TYPE_1 0
#define TYPE_2 1
#define TYPE_3 2
#define TYPE_4 3
#define TYPE_5 4
#define TYPE_6 5

enum CAMERA_TYPE {
  PINHOLE = 1,
  FISHEYE = 2,
};

namespace stryx {

struct Vector {
  Vector() {
    x = 0;
    y = 0;
    z = 0;
  }

  double x, y, z;

  double length() {
    return sqrt(this->x * this->x + this->y * this->y + this->z * this->z);
  }

  Vector operator-() {
    Vector result;
    result.x = -this->x;
    result.y = -this->y;
    result.z = -this->z;

    return result;
  }
  Vector operator+(Vector &other) {
    Vector result;
    result.x = this->x + other.x;
    result.y = this->y + other.y;
    result.z = this->z + other.z;

    return result;
  }
  Vector operator-(Vector &other) {
    Vector result;
    result.x = this->x - other.x;
    result.y = this->y - other.y;
    result.z = this->z - other.z;

    return result;
  }
  Vector operator*(double &other) {
    Vector result;
    result.x = this->x * other;
    result.y = this->y * other;
    result.z = this->z * other;

    return result;
  }
  Vector operator/(double &other) {
    Vector result;
    result.x = this->x / other;
    result.y = this->y / other;
    result.z = this->z / other;

    return result;
  }
};

struct Euler {
  Euler() {
    roll = 0;
    pitch = 0;
    yaw = 0;
  }

  void fromRPYDegree(double roll, double pitch, double yaw) {
    this->roll = Degree2Radian(roll);
    this->pitch = Degree2Radian(pitch);
    this->yaw = Degree2Radian(yaw);
  }

  void fromRPYRadian(double roll, double pitch, double yaw) {
    this->roll = roll;
    this->pitch = pitch;
    this->yaw = yaw;
  }

  void calcMatrix(int type) {
    switch (type) {
    case TYPE_1:
      matrix[0][0] = cos(pitch) * cos(yaw);
      matrix[0][1] = cos(roll) * sin(yaw) + cos(yaw) * sin(pitch) * sin(roll);
      matrix[0][2] = sin(roll) * sin(yaw) - cos(roll) * cos(yaw) * sin(pitch);

      matrix[1][0] = -cos(pitch) * sin(yaw);
      matrix[1][1] = cos(roll) * cos(yaw) - sin(pitch) * sin(roll) * sin(yaw);
      matrix[1][2] = cos(yaw) * sin(roll) + cos(roll) * sin(pitch) * sin(yaw);

      matrix[2][0] = sin(pitch);
      matrix[2][1] = -cos(pitch) * sin(roll);
      matrix[2][2] = cos(pitch) * cos(roll);
      break;

    case TYPE_2:
      matrix[0][0] = cos(yaw) * cos(roll) - sin(yaw) * sin(pitch) * sin(roll);
      matrix[0][1] = -cos(pitch) * sin(yaw);
      matrix[0][2] = cos(yaw) * sin(roll) + sin(yaw) * cos(roll) * sin(pitch);

      matrix[1][0] = sin(yaw) * cos(roll) + cos(yaw) * sin(pitch) * sin(roll);
      matrix[1][1] = cos(yaw) * cos(pitch);
      matrix[1][2] = sin(yaw) * sin(roll) - cos(yaw) * cos(roll) * sin(pitch);

      matrix[2][0] = -cos(pitch) * sin(roll);
      matrix[2][1] = sin(pitch);
      matrix[2][2] = cos(pitch) * cos(roll);
      break;

    case TYPE_3:
      matrix[0][0] = cos(roll) * cos(yaw) - sin(pitch) * sin(roll) * sin(yaw);
      matrix[1][0] = -cos(pitch) * sin(yaw);
      matrix[2][0] = cos(yaw) * sin(roll) + cos(roll) * sin(pitch) * sin(yaw);

      matrix[0][1] = cos(roll) * sin(yaw) + cos(yaw) * sin(pitch) * sin(roll);
      matrix[1][1] = cos(pitch) * cos(yaw);
      matrix[2][1] = sin(roll) * sin(yaw) - cos(roll) * cos(yaw) * sin(pitch);

      matrix[0][2] = -cos(pitch) * sin(roll);
      matrix[1][2] = sin(pitch);
      matrix[2][2] = cos(pitch) * cos(roll);
      break;

    case TYPE_4:
      matrix[0][0] = cos(roll) * cos(yaw) - sin(pitch) * sin(roll) * sin(yaw);
      matrix[0][1] = -cos(pitch) * sin(yaw);
      matrix[0][2] = cos(yaw) * sin(roll) + cos(roll) * sin(pitch) * sin(yaw);

      matrix[1][0] = cos(roll) * sin(yaw) + cos(yaw) * sin(pitch) * sin(roll);
      matrix[1][1] = cos(pitch) * cos(yaw);
      matrix[1][2] = sin(roll) * sin(yaw) - cos(roll) * cos(yaw) * sin(pitch);

      matrix[2][0] = -cos(pitch) * sin(roll);
      matrix[2][1] = sin(pitch);
      matrix[2][2] = cos(pitch) * cos(roll);

      break;

    case TYPE_5:
      matrix[0][0] = cos(pitch) * cos(yaw);
      matrix[1][0] = cos(roll) * sin(yaw) + cos(yaw) * sin(pitch) * sin(roll);
      matrix[2][0] = sin(roll) * sin(yaw) - cos(roll) * cos(yaw) * sin(pitch);

      matrix[0][1] = -cos(pitch) * sin(yaw);
      matrix[1][1] = cos(roll) * cos(yaw) - sin(pitch) * sin(roll) * sin(yaw);
      matrix[2][1] = cos(yaw) * sin(roll) + cos(roll) * sin(pitch) * sin(yaw);

      matrix[0][2] = sin(pitch);
      matrix[1][2] = -cos(pitch) * sin(roll);
      matrix[2][2] = cos(pitch) * cos(roll);

      break;

    case TYPE_6:
      matrix[0][0] = cos(yaw) * cos(roll) - sin(yaw) * sin(pitch) * sin(roll);
      matrix[1][0] = -cos(pitch) * sin(yaw);
      matrix[2][0] = cos(yaw) * sin(roll) + sin(yaw) * cos(roll) * sin(pitch);

      matrix[0][1] = sin(yaw) * cos(roll) + cos(yaw) * sin(pitch) * sin(roll);
      matrix[1][1] = cos(yaw) * cos(pitch);
      matrix[2][1] = sin(yaw) * sin(roll) - cos(yaw) * cos(roll) * sin(pitch);

      matrix[0][2] = -cos(pitch) * sin(roll);
      matrix[1][2] = sin(pitch);
      matrix[2][2] = cos(pitch) * cos(roll);
      break;

    default:
      break;
    }
  }

  double roll, pitch, yaw;
  double matrix[3][3];
};

struct EOP {
  Vector t;
  double r[3][3];
};

struct IOP {
  double pp[2];
  double f_mm;
  int32_t Nw, Nh;
  double Fw, Fh;
  double k[5];
  double fb;
};

struct GPSTime {
  GPSTime() {
    week = 0;
    second = 0;
  }

  uint32_t week;
  double second;

  double operator-(GPSTime &other) {
    return (this->second - other.second) +
           (this->week - other.week) * MAX_SECOND;
  }

  bool operator<(GPSTime &other) {
    if (this->week == other.week) {
      return this->second < other.second;
    } else {
      return this->week < other.week;
    }
  }

  bool operator<=(GPSTime &other) {
    if (this->week == other.week) {
      return this->second <= other.second;
    } else {
      return this->week <= other.week;
    }
  }
};

struct Point2d {
  Point2d() {
    this->x = 0;
    this->y = 0;
  }

  Point2d(double x, double y) {
    this->x = x;
    this->y = y;
  }
  double x;
  double y;
};

struct Point {
  Point() {
    this->p.x = 0;
    this->p.y = 0;
    this->p.z = 0;

    this->intensity = 0;
    this->id = 0;
    this->r = 0;
    this->g = 0;
    this->b = 0;
    this->time.week = 0;
    this->time.second = 0;
  }

  Vector p;
  uint16_t intensity;
  uint8_t id; // 2-bit lidar id, 6-bit channel id
  uint16_t r, g, b;
  GPSTime time;
};

struct PoseEuler {
  Vector t;
  Euler e;
  GPSTime time;

  bool operator<(PoseEuler &other) { return this->time < other.time; }

  bool operator<=(PoseEuler &other) { return this->time <= other.time; }

  Vector operator*(Vector &other) {
    Vector result;

    result.x = e.matrix[0][0] * other.x + e.matrix[0][1] * other.y +
               e.matrix[0][2] * other.z;
    result.y = e.matrix[1][0] * other.x + e.matrix[1][1] * other.y +
               e.matrix[1][2] * other.z;
    result.z = e.matrix[2][0] * other.x + e.matrix[2][1] * other.y +
               e.matrix[2][2] * other.z;

    return result;
  }

  Point operator*(Point &other) {
    Point result;

    result = other;

    result.p.x = e.matrix[0][0] * other.p.x + e.matrix[0][1] * other.p.y +
                 e.matrix[0][2] * other.p.z;
    result.p.y = e.matrix[1][0] * other.p.x + e.matrix[1][1] * other.p.y +
                 e.matrix[1][2] * other.p.z;
    result.p.z = e.matrix[2][0] * other.p.x + e.matrix[2][1] * other.p.y +
                 e.matrix[2][2] * other.p.z;

    //		result.p = result.p + this->t;

    return result;
  }
  PoseEuler inverse() {
    PoseEuler result;

    result.e.matrix[0][0] = e.matrix[0][0];
    result.e.matrix[0][1] = e.matrix[1][0];
    result.e.matrix[0][2] = e.matrix[2][0];

    result.e.matrix[1][0] = e.matrix[0][1];
    result.e.matrix[1][1] = e.matrix[1][1];
    result.e.matrix[1][2] = e.matrix[2][1];

    result.e.matrix[2][0] = e.matrix[0][2];
    result.e.matrix[2][1] = e.matrix[1][2];
    result.e.matrix[2][2] = e.matrix[2][2];

    return result;
  }
};

struct CameraInfo {
  PoseEuler eop;
  IOP iop;
  int lensType;
  double distance;
};

class SPointConvertor {

public:
  SPointConvertor();
  std::vector<Point2d> xyzToImageCoor(CameraInfo camera, PoseEuler pos,
                                      std::vector<Point> points);
  Point2d xyzToImageCoor(CameraInfo camera, PoseEuler pos, Point point);

  std::vector<Point2d> xyzToImageCoor(PoseEuler pos, std::vector<Point> points);
  Point2d xyzToImageCoor(PoseEuler pos, Point point);

  void setCameraInfo(CameraInfo camera);

private:
  CameraInfo _camera;
};
} // namespace stryx
#endif // SPOINTCONVERTOR_H
