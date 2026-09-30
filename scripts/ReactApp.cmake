include_guard(GLOBAL)

include(FetchContent)
cmake_policy(SET CMP0135 NEW)

function(get_nodejs)
	set(nodejs_url)
	if(${CMAKE_HOST_SYSTEM_NAME} STREQUAL Windows)
		set(nodejs_url "https://nodejs.org/dist/latest-v26.x/node-v26.10.0-win-x64.zip")
	elseif(${CMAKE_HOST_SYSTEM_NAME} STREQUAL Linux)
		set(nodejs_url "https://nodejs.org/dist/latest-v26.x/node-v26.10.0-linux-x64.tar.xz")
	elseif(${CMAKE_HOST_SYSTEM_NAME} STREQUAL Darwin)
	else()
		message(FATAL_ERROR "Unsupported system: ${CMAKE_HOST_SYSTEM_NAME}")
	endif()
	
	FetchContent_Declare(
	    nodejs_bin
    	URL ${nodejs_url}
	)
	
	message(STATUS "trying to fetch nodejs")
	FetchContent_Populate(nodejs_bin)

	if(WIN32)
   		set(NPM_EXECUTABLE "${nodejs_bin_SOURCE_DIR}/npm.cmd" CACHE INTERNAL "")
		set(NEW_PATH "${nodejs_bin_SOURCE_DIR};$ENV{PATH}")
	else()
   		set(NPM_EXECUTABLE "${nodejs_bin_SOURCE_DIR}/bin/npm" CACHE INTERNAL "")
   		set(NEW_PATH "${nodejs_bin_SOURCE_DIR}/bin:$ENV{PATH}")
	endif()

	set(ENV{PATH} "${NEW_PATH}")
	message(STATUS "trying to npm install")
	execute_process(
		COMMAND ${NPM_EXECUTABLE} install --save npm react react-dom 
		WORKING_DIRECTORY "${nodejs_bin_SOURCE_DIR}"
		RESULT_VARIABLE NPM_RESULT
	)
	if(NOT NPM_RESULT EQUAL 0)
		message(FATAL_ERROR "${NPM_EXECUTABLE} install --save npm react react-dom failed")
	endif()

	message(STATUS "npm path: ${NPM_EXECUTABLE}")	
endfunction()
