desc "Runs the application in development mode"

task :default => ['run:development']
task :test => 'run:test'

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
end

%w(development test production).each do |env|
  desc "Runs the application in the #{env} environment"
  task "run:#{env}" => "staticmatic:build" do
    exec "cd site ; adl #{env}.xml"
  end
end
