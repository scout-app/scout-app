namespace :air do
  namespace :runtime do
    desc 'Prints out the current version of the Adobe AIR Runtime'
    task :version do
      require 'adobe/air'
      Adobe::Air.print_version
    end

    desc "Checks to see if you're running a compatible Adobe AIR Runtime"
    task :check do
      require 'adobe/air'
      fail unless Adobe::Air.print_version_check
    end

    desc 'Launch the Adobe AIR download page'
    task :download do
      require 'adobe/air'
      Adobe::Air.go_to_download_page
    end
  end
  
  namespace :sdk do
    desc "Checks to see if you're running a compatible Adobe AIR SDK"
    task :check do
      require 'adobe/air'
      fail unless Adobe::Air.print_sdk_check
    end
    
    desc 'Launch the Adobe AIR SDK download page'
    task :download do
      require 'adobe/air'
      Adobe::Air.go_to_sdk_download_page
    end
    
    desc 'Install the Adobe AIR SDK via Homebrew if available, otherwise launch the download page'
    task :install do
      require 'adobe/air'
      Adobe::Air.install_sdk
    end
  end
end