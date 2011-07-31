desc "Build Scout"
task :build => ['environment', "air:runtime:check", "air:sdk:check", "build:jruby", "build:bundle", "build:bin", "build:staticmatic", "build:config"]

namespace :build do
  task :jruby do
    FileUtils.mkdir_p(Scout.build_vendor_directory)
    unless File.exists?(Scout.jruby_complete_jar)
      puts "Downloading JRuby Complete #{Scout.jruby_version}..."
      # TODO: Downlaod this file via Ruby
      # open "http://jruby.org.s3.amazonaws.com/downloads/#{jruby_version}/jruby-complete-#{jruby_version}.jar"
    end
    # GEM_HOME=$VENDOR/gems
    # GEM_PATH=$VENDOR/gems
    # ./$dir/jruby -S gem install -r bundler
    # export GEM_HOME
    # export GEM_PATH
    # java -jar $JRUBY_INSTALLATION $@
  end
  
  task :bundle do
    # GEM_HOME=$VENDOR/gems
    # GEM_PATH=$VENDOR/gems
    # BUNDLER=$GEM_HOME/bin/bundle
    # ./$dir/jruby $BUNDLER --without "build" $@ 
    # export GEM_HOME
    # export GEM_PATH
    # java -jar $JRUBY_INSTALLATION $@
  end
  
  task :bin do
    FileUtils.cp_r(Scout.src_bin_directory, Scout.build_directory)
  end

  desc "Runs bin/staticmatic build on the current directory"
  task :staticmatic do
    system "staticmatic build #{Scout.root}"
  end

  task :config do
    FileUtils.cp_r(Scout.config_files, Scout.build_directory)
    # TODO: Gemfile?
  end

  desc "Clears dev environment by removing build/vendor. See dev:redo" 
  task :clean do
    FileUtils.rm_rf(Scout.build_directory)
  end
  
  desc "Runs dev:clean, then dev:setup"
  task :redo => ["build:clean", "build"]
end