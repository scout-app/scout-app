require 'rubygems'
require 'bundler'

require File.join(File.dirname(__FILE__), "version")

env_specific_file = File.join(File.dirname(__FILE__), "environments", "#{ENV["SCOUT_ENV"]}.rb")
require env_specific_file if File.exists?(env_specific_file)

Bundler.require(:default)

$: << File.join(File.dirname(__FILE__), '..', 'lib')

class Scout
  def self.version
    require File.join File.dirname(__FILE__), 'version'
    SCOUT_VERSION
  end
  
  def self.root
    File.expand_path(File.join(File.dirname(__FILE__), ".."))
  end
  
  def self.config_directory
    File.join(root, "config")
  end
    
  def self.config_files
    Dir[File.join(config_directory, "*.xml")]
  end
  
  def self.runtime_config_directory
    File.join(root, "src/config")
  end
  
  def self.download(url, destination)
    require 'open-uri'
    open(destination, "wb"){ |f| f.write open(url).read }
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
  
  def self.install_jruby_with_bundler
    download jruby_download_url, jruby_complete_jar
  end  
  
  def self.jruby_version
    "1.6.3"
  end
  
  def self.jruby_download_url
    "http://jruby.org.s3.amazonaws.com/downloads/#{jruby_version}/jruby-complete-#{jruby_version}.jar"
  end

  def self.jruby_complete_jar
    File.join(build_vendor_directory, "jruby-complete.jar")
  end
  
  def self.jruby_gem_exists?(gem_name)
    Dir["#{jruby_gem_path}/gems/#{gem_name}*"].any?
  end

  def self.jruby_gem_home
    "#{build_vendor_directory}/gems"
  end
  
  def self.jruby_gem_path
    jruby_gem_home
  end
  
  module JRubyExec
    def with_env(options, &blk)
      original_env = ENV.to_hash
      options.each_pair{ |k,v| ENV[k] = v }
      blk.call
      ENV.clear
      original_env.each_pair { |k,v| ENV[k] = v }
    end
    
    def jruby(command)
      with_env(
        "GEM_HOME" => Scout.jruby_gem_home,
        "GEM_PATH" => Scout.jruby_gem_path,
        "BUNDLE_GEMFILE" => nil,
        "BUNDLE_BIN_PATH" => nil,
        "RUBYOPT" => nil,
        "SCOUT_ENV" => "development"
      ) do
        puts `java -jar #{Scout.jruby_complete_jar} -S #{command}`
      end
    end
  end
end

include Scout::JRubyExec