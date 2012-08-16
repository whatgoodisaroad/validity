# Directories
proj_dir 		= $(shell pwd)
code_dir 		= $(proj_dir)/src
comp_dir 		= $(proj_dir)/compiler
build_dir 		= $(proj_dir)/build

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
date 			= $(shell date '+%F \(%A, %d %B %Y\)')
version 		= $(shell cat ./version.txt)
compiler 		= $(comp_dir)/compiler.jar
additional		= $(code_dir)/jquery.validity.lang.* $(code_dir)/arrow.gif $(proj_dir)/README.md

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
	@ echo "Compressing files..."
	@ cd $(build_dir); tar -cvf jquery.validity.$(version).tar ./*
	@ cd $(build_dir); ls|grep -v .tar |xargs rm; 
	@ echo "Done"

clean:
	@ echo "Cleaning..."
	@ rm -rf $(build_dir)
	
