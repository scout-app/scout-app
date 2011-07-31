%w(development test production).each do |env|
  desc "Runs the application in the #{env} environment"
  task "run:#{env}" => "build" do
    exec "cd build ; adl #{env}.xml"
  end
end
