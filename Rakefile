desc "Runs the application in development mode"

task :run => 'run:development'
task :test => 'run:test'

namespace 'staticmatic' do
  desc "Runs bin/staticmatic build on the current directory"
  task 'build' do
    system 'bin/staticmatic build .'
  end
end

%w(development test production).each do |env|
  desc "Runs the application in the #{env} environment"
  task "run:#{env}" => "staticmatic:build" do
    exec "adl site/#{env}.xml"
  end
end
