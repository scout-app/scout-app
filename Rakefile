require 'bundler'

require File.join File.dirname(__FILE__), 'lib/adobe/air'

desc "Runs the application in development mode"
task :default => ['run:development']
task :test => 'run:test'

namespace :dev do
  desc "Sets up the development environment in a *nix environment"
  task :setup => ["air:version:check", "air:sdk:check"] do
    system 'bin/install_jruby && bin/bundle'
    puts <<-EOT
      **************************************************************
         If you received no errors you can run "bin/rake" to
         run ScoutApp in development mode. See bin/rake -T 
         for more things you can do.
      **************************************************************
    EOT
  end
  
  desc "Clears dev environment by removing site/vendor. See dev:redo" 
  task :clean do
    FileUtils.rm_rf File.join(File.dirname(__FILE__), "site/vendor")
  end
  
  desc "Runs dev:clean, then dev:setup"
  task :redo => ["dev:clean", "dev:setup"]
end


namespace 'air' do
  desc 'Launch the Adobe AIR download page'
  task 'download' do
    Adobe::Air.go_to_download_page
  end

  desc 'Prints out the current version of the Adobe AIR Runtime'
  task 'version' do
    Adobe::Air.print_version
  end
  
  namespace 'sdk' do
    desc "Checks to see if you're running a compatible Adobe AIR SDK"
    task 'check' do
      fail unless Adobe::Air.print_sdk_check
    end
    
    desc 'Launch the Adobe AIR SDK download page'
    task 'download' do
      Adobe::Air.go_to_sdk_download_page
    end
  end

  namespace 'version' do
    desc "Checks to see if you're running a compatible Adobe AIR Runtime"
    task 'check' do
      fail unless Adobe::Air.print_version_check
    end
  end
end

namespace 'staticmatic' do
  desc "Runs bin/staticmatic build on the current directory"
  task 'build' do
    system 'bin/staticmatic build .'
  end
end

namespace 'package' do
  desc 'packages the application as an OSX installer'
  task 'dmg' do
    system "bin/package_app dmg"
  end
  task 'exe' do
    system "bin/package_app exe"
  end
end

%w(development test production).each do |env|
  desc "Runs the application in the #{env} environment"
  task "run:#{env}" => "staticmatic:build" do
    exec "cd site ; adl #{env}.xml"
  end
end
