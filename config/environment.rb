require 'rubygems'
require 'bundler'

Bundler.require(:default, :build)

$: << File.join(File.dirname(__FILE__), '..', 'lib')

class Scout
  def self.root
    File.expand_path(File.join(File.dirname(__FILE__), ".."))
  end
  
  def self.config_directory
    File.join(root, "config")
  end
  
  def self.config_files
    Dir[File.join(config_directory, "*.xml")]
  end

  def self.src_directory
    File.join(root, "src")
  end

  def self.src_bin_directory
    File.join(src_directory, "bin")
  end

  def self.src_images_directory
    File.join(src_directory, "images")
  end

  def self.src_javascripts_directory
    File.join(src_directory, "javascripts")
  end

  def self.src_stylesheets_directory
    File.join(src_directory, "stylesheets")
  end
  
  def self.build_directory
    File.join(root, "build")
  end

  def self.build_vendor_directory
    File.join(build_directory, "vendor")
  end
  
  def self.jruby_version
    "1.6.3"
  end

  def self.jruby_complete_jar
    File.join(build_vendor_directory, "jruby-complete-#{jruby_version}.jar")
  end
end