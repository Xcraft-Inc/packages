set( CMAKE_SYSTEM_NAME Linux )
set( CMAKE_SYSTEM_PROCESSOR arm64 )

set( target aarch64-xcraft-linux-gnu )

set( CMAKE_C_COMPILER    aarch64-xcraft-linux-gnu-gcc )
set( CMAKE_CXX_COMPILER  aarch64-xcraft-linux-gnu-g++ )

set( CMAKE_C_COMPILER_TARGET   ${target} )
set( CMAKE_CXX_COMPILER_TARGET ${target} )

set( arch_c_flags "-mcpu=cortex-a76+crc+crypto" )
set( warn_c_flags "-Wno-format -Wno-unused-variable -Wno-unused-function" )

set( CMAKE_C_FLAGS_INIT   "${arch_c_flags} ${warn_c_flags}" )
set( CMAKE_CXX_FLAGS_INIT "${arch_c_flags} ${warn_c_flags}" )