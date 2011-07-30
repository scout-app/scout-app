# USE THIS FILE IF YOU ARE NOT USING STATICMATIC

require 'pathname'
dir = Pathname.new(File.dirname(__FILE__))

project_type = :stand_alone
css_dir = dir.join("../build/stylesheets").to_s
sass_dir = dir.join("../src/stylesheets").to_s