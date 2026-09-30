if(${NPM_EXECUTABLE} STREQUAL "" OR NOT EXISTS ${NPM_EXECUTABLE})
	message(WARNING "npm not found: ${NPM_EXECUTABLE}")
	return()
endif()

set(PACKAGE_JSON_PATH "${CMAKE_CURRENT_SOURCE_DIR}/package.json")
if(EXISTS "${PACKAGE_JSON_PATH}")
	file(MD5 "${PACKAGE_JSON_PATH}" CURRENT_PACKAGE_HASH)
	if(NOT "${CURRENT_PACKAGE_HASH}" STREQUAL "${LAST_PACKAGE_HASH}")
		execute_process(
			COMMAND ${NPM_EXECUTABLE} ci
			WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}"
			RESULT_VARIABLE NPM_RESULT
		)
		if(NOT NPM_RESULT EQUAL 0)
			message(FATAL_ERROR "npm ci failed")
		endif()
		set(LAST_PACKAGE_HASH "${CURRENT_PACKAGE_HASH}" CACHE INTERNAL "Last package.json hash")	
	endif()
endif()

get_filename_component(NODE_BIN_DIR "${NPM_EXECUTABLE}" DIRECTORY)
if(WIN32)
    set(NEW_PATH "${NODE_BIN_DIR};$ENV{PATH}")
else()
    set(NEW_PATH "${NODE_BIN_DIR}:$ENV{PATH}")
endif()

set(ENV{PATH} "${NEW_PATH}")
execute_process(
	COMMAND ${NPM_EXECUTABLE} run build -- --emptyOutDir --outDir "${CMAKE_BINARY_DIR}/bin/ReactApp"
	WORKING_DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}"
	RESULT_VARIABLE NPM_RESULT
)
if(NOT NPM_RESULT EQUAL 0)
	message(FATAL_ERROR "npm run build failed")
endif()

file(GLOB ASSET_FILES "${CMAKE_BINARY_DIR}/bin/ReactApp/assets/*")
foreach(asset ${ASSET_FILES})
	get_filename_component(asset_file_name "${asset}" NAME)
	get_filename_component(asset_ext "${asset}" EXT)
	message(STATUS "${asset} ext: ${asset_ext}")
	if(${asset_ext} STREQUAL ".js")
		set(REACT_APP_FILE_JS ${asset_file_name})
	elseif(${asset_ext} STREQUAL ".css")
		set(REACT_APP_FILE_CSS ${asset_file_name})
	else()
		message(WARNING "unexpected asset: ${asset_file_name}")
	endif()
endforeach()

if("${REACT_APP_FILE_JS}" STREQUAL "")
	message(FATAL_ERROR "ReactApp js not found")
endif()
if("${REACT_APP_FILE_CSS}" STREQUAL "")
	message(FATAL_ERROR "ReactApp css not found")
endif()

configure_file("${CMAKE_CURRENT_SOURCE_DIR}/scripts/index.html.in" "${CMAKE_BINARY_DIR}/bin/ReactApp/index.html" @ONLY)
install(FILES ${ASSET_FILES} DESTINATION ReactApp/assets)
install(FILES "${CMAKE_BINARY_DIR}/bin/ReactApp/index.html" DESTINATION ReactApp)
