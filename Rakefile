desc "Runs the application in development mode"

task :default => ['run:development']
task :test => 'run:test'

desc "sets up the development environment in a *nix environment"
task :setup_dev do
  system 'bin/install_adt && bin/install_jruby && bin/bundle'
  puts <<-EOT
    **************************************************************
       If you received no errors you can run "rake" to
       run CompassApp. See rake -T for more things you can do.
    **************************************************************
  EOT
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
