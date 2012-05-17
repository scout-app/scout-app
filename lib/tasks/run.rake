%w(development test production).each do |env|
  desc "Runs the application in the #{env} environment"
  task "run:#{env}" => "build:#{env}" do
    with_env(
      "GEM_HOME" => nil,
      "GEM_PATH" => nil,
      "BUNDLE_GEMFILE" => nil,
      "BUNDLE_BIN_PATH" => nil,
      "RUBYOPT" => nil,
      "SCOUT_ENV" => env
    ) do
      Dir.chdir "build" do
        exec "adl #{env}.xml"
      end
    end
  end
end
