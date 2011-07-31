require 'launchy'

require 'term/ansicolor'
include Term::ANSIColor

require File.join File.dirname(__FILE__), '../homebrew'

module Adobe
  module Air
    class Error < ::StandardError ; end
    class RuntimeNotFound < Error ; end
    class SdkNotFound < Error ; end
    class MissingVersion < Error ; end

    # http://kb2.adobe.com/cps/407/kb407625.html
    InfoPlistFilePath = "/Library/Frameworks/Adobe AIR.framework/Versions/1.0/Resources/Info.plist"
    
    RuntimeDownloadUrl = "http://get.adobe.com/air/"
    SdkDownloadUrl = "http://www.adobe.com/products/air/sdk/"

    MinimumRuntimeVersion = "2.7"
    MinimumSdkVersion = "2.5"
    
    SdkCommand = "adt"
    CheckForSdkCommand = "which #{SdkCommand}"
    
    SdkHomebrewPackage = "adobe-air-sdk"
    
    def self.go_to_download_page
      puts "Opening #{RuntimeDownloadUrl} in your browser"
      Launchy.open RuntimeDownloadUrl
      return true
    end
    
    def self.go_to_sdk_download_page
      puts "Opening #{SdkDownloadUrl} in your browser"
      Launchy.open SdkDownloadUrl
      return true
    end
    
    def self.install_sdk
      if Homebrew.exists?
        puts "Installing the Adobe AIR SDK via Homebrew"
        Homebrew.install(SdkHomebrewPackage)
      else
        go_to_sdk_download_page
      end
    end
    
    def self.version
      begin
        body = IO.read InfoPlistFilePath
      rescue
        raise RuntimeNotFound, <<-EOT.gsub(/ +\|/, '').chomp
          |Could not find Adobe AIR installation. To download/install run:
          |
          |  rake air:download
          |
          |File not found: #{InfoPlistFilePath}
        EOT
      end

      _version = body.scan(/<key>CFBundleVersion<\/key>\s*<string>(.*?)<\/string>/m).flatten.first
      if _version.nil? || _version.length == 0
        raise MissingVersion, <<-EOT.gsub(/ +\|/, '').chomp
          |Found Adobe AIR Runtime, but could not find version information in:
          |
          |  #{InfoPlistFilePath}
          |
          |You may need to re-install Adobe AIR. Or if Adobe AIR is installed to
          |a non-standard location you may need to not use this rake task.
        EOT
      end
      _version
    end
    
    def self.sdk_version
      if `#{CheckForSdkCommand}`.length == 0
        raise SdkNotFound, <<-EOT.gsub(/ +\|/, '').chomp
          |Cannot locate Adobe AIR SDK. Make sure it is installed and is in your PATH.
          |
          |You can run "rake air:sdk:install" to get started installing a new version of AIR SDK.
        EOT
      end
      
      _sdk_version = `#{SdkCommand} -version`.chomp.scan(/[\d\.]+/).first
    end
  
    def self.print_sdk_check
      _sdk_version = sdk_version
      if _sdk_version < MinimumSdkVersion
        error = <<-EOT.gsub(/ +\|/, '').chomp
          |You are running an out-of-date version of Adobe AIR SDK:
          |  Minimum required: #{MinimumSdkVersion}
          |  Your version :    #{_sdk_version}
          |
          |You can run "rake air:sdk:install" to get started installing a new version of AIR SDK.
        EOT
        puts red(error)
        return false
      else
        puts green("Adobe AIR SDK: #{_sdk_version}")
        return true
      end
    rescue SdkNotFound => ex
      puts red(ex.message)
      return false
    end
    
    def self.print_version
      puts version
      return true
    rescue Error => ex
      puts red(ex.message)
      return false
    end
    
    def self.print_version_check
      _version = version
      if _version < MinimumRuntimeVersion
        error = <<-EOT.gsub(/ +\|/, '').chomp
          |You are running an out-of-date version of Adobe AIR Runtime:
          |  Minimum required: #{MinimumRuntimeVersion}
          |  Your version :    #{_version}
          |
          |You can run "rake air:download" to get started installing a new version of AIR.
        EOT
        puts red(error)
        return false
      else
        puts green("Adobe AIR runtime: #{_version}")
        return true
      end
    end
    
  end
end