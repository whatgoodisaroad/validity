# Directories
proj_dir 		= $(shell pwd)
code_dir 		= $(proj_dir)/src
l18n_dir		= $(proj_dir)/l18n
comp_dir 		= $(proj_dir)/compiler
build_dir 		= $(proj_dir)/build
test_build_dir 	= $(proj_dir)/tests/build
demo_dir		= $(proj_dir)/demo
demo_css_dir 	= $(demo_dir)/css
demo_js_dir 	= $(demo_dir)/js

# Source files.
code_header_src = $(code_dir)/jquery.validity.header.js
code_core 		= $(code_dir)/jquery.validity.core.js
code_outputs 	= $(code_dir)/jquery.validity.outputs.js
code_files 		= $(code_core) $(code_outputs)

# Target files
code_header 	= $(build_dir)/full_header.js
targ_debug_file = $(build_dir)/jquery.validity.js
targ_temp_file 	= $(build_dir)/jquery.validity.temp.js
targ_min_file 	= $(build_dir)/jquery.validity.min.js

# Compiler flags
comp_includes 	= --js=$(code_core) --js=$(code_outputs)
comp_output 	= --js_output_file=$(targ_temp_file)

# Misc
jQueryVersion 	= "1.10.2"
jQueryFile 		= $(proj_dir)/jquery-$(jQueryVersion).min.js
date 			= $(shell date '+%F \(%A, %d %B %Y\)')
version 		= $(shell cat ./version.txt)
compiler 		= $(comp_dir)/compiler.jar
additional		= $(l18n_dir)/*.js $(code_dir)/arrow.gif $(code_dir)/README.md $(code_dir)/jquery.validity.css $(jQueryFile) $(code_dir)/example.htm


build: clean
	@ echo "Building validity..."

	@ echo "Creating build directory..."
	@ mkdir $(build_dir)
	
	@ echo "Building header..."
	@ cat $(code_header_src) | sed 's/__date__/$(date)/' | sed 's/__version__/$(version)/' > $(code_header)

	@ echo "Building..."
	@ cat $(code_header) $(code_files) > $(targ_debug_file)
	@ java -jar $(compiler) $(comp_includes) $(comp_output)
	@ cat $(code_header) > $(targ_min_file)
	@ cat $(targ_temp_file) >> $(targ_min_file)
	
	@ echo "Removing temporary files..."
	@ rm $(targ_temp_file) $(code_header)

	@ echo "Copying additional files..."
	@ cp $(additional) $(build_dir)

	@ echo "Done."

archive: build
	@ echo "Archiving files..."
	@ cd $(build_dir); tar -zcvf jquery.validity.$(version).tar.gz ./*
	@ cd $(build_dir); ls|grep -v .tar |xargs rm; 
	@ echo "Done"

tests: build
	@ echo "Preparing test build..."
	@ cp $(build_dir)/* $(proj_dir)/tests/build
	@ cp $(proj_dir)/tests/build/jquery.validity.js validity.js
	@ cp $(test_build_dir)/jquery.validity.js $(test_build_dir)/validity.js

min_tests: build
	@ echo "Preparing test build..."
	@ cp $(build_dir)/* $(test_build_dir)
	@ cp $(test_build_dir)/jquery.validity.min.js $(test_build_dir)/validity.js

demo: build
	@ cp $(build_dir)/jquery.validity.css $(demo_css_dir)
	@ cp $(build_dir)/*.js $(demo_js_dir)

clean:
	@ echo "Cleaning..."
	@ rm -rf $(build_dir)
	@ rm -rf $(test_build_dir)/*
	
