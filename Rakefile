tasks_directory = File.join(File.dirname(__FILE__), "lib", "tasks")
Dir[File.join(tasks_directory, "*.rake")].each { |file| load file  }

desc "Build and run Scout in the development environment"
task :default => ['run:development']

task :environment do
  config_directory = File.join(File.dirname(__FILE__), "config")
  require File.join(config_directory, "environment")
end