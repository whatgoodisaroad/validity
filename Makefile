proj_dir = $(shell pwd)
code_dir = $(proj_dir)/jQuery.validity
comp_dir = $(proj_dir)/compiler
build_dir = $(proj_dir)/build

rel_code_header = jQuery.validity.header.js
rel_code_core = jQuery.validity.core.js
rel_code_outputs = jQuery.validity.outputs.js
rel_code_files = $(rel_code_core) $(rel_code_outputs)

abs_code_header = $(code_dir)/$(rel_code_header)
abs_code_core = $(code_dir)/$(rel_code_core)
abs_code_outputs = $(code_dir)/$(rel_code_outputs)
abs_code_files = $(abs_code_core) $(abs_code_outputs)

rel_build_file = jQuery.validity.build.js
rel_output_file = jQuery.validity.js

comp_includes = --js=$(rel_code_header) --js=$(rel_code_core) --js=$(rel_code_outputs)
comp_output = --js_output_file=$(rel_build_file)

all:
	@ echo "Building jQuery.validity..."
		
	@ echo "Preparing build directory... (./build/)"
	@ mkdir -p $(build_dir)
	@ rm -rf $(build_dir)/*
	
	@ echo "Copying code files..."
	@ cp $(abs_code_files) $(comp_dir)
	
	@ echo "Compiling..."
	@ cd $(comp_dir); java -jar ./compiler.jar $(comp_includes) $(comp_output)
	
	@ echo "Formatting..."
	@ cat $(abs_code_header) > $(comp_dir)/$(rel_output_file)
	@ cat $(comp_dir)/$(rel_build_file) >> $(comp_dir)/$(rel_output_file)
	
	@ echo "Copying to build directory..."
	@ cp $(comp_dir)/$(rel_output_file) $(build_dir)
	
	@ echo "Done."
	
clean:
	