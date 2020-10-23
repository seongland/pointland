{
  "targets": [
    {
      "target_name": "tool",
      "cflags!": [
        "-fno-exceptions"
      ],
      "cflags_cc": [
        "-std=c++17"
      ],
      "cflags_cc!": [
        "-fno-exceptions"
      ],
      "sources": [
        "addon/index.cc",
        "addon/src/converter.cc"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "libraries": [
        "<(module_root_dir)/addon/lib/converter/libSPointConvertor.a"
      ],
      "defines": [
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ]
    }
  ]
}