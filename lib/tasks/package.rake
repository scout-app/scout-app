
task "package:environment" => [:environment] do
  require "packager"
end

namespace 'package' do
  desc "Creates a self signed certificate for you to package the application with for distribution"
  task 'makecert' => ["package:environment"] do
    exit 1 unless Packager.make_certificate!
  end

  desc 'Packages the application as an OSX installer'
  task 'dmg' => ["package:environment"] do
    exit 1 unless Packager.package_dmg! "pkg/"
  end
  
  desc 'Packages the application as a Windows installer'
  task 'exe' => ["package:environment"] do
    exit 1 unless Packager.package_exe! "pkg/"    
  end
end