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
      exec "cd build ; adl #{env}.xml"
    end
  end
end
