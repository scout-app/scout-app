require 'launchy'

require 'term/ansicolor'
include Term::ANSIColor

module Adobe
  module Air
    class Error < ::StandardError ; end
    class SDKNotFound < Error ; end
    class MissingVersion < Error ; end

    # http://kb2.adobe.com/cps/407/kb407625.html
    InfoPlistFilePath = "/Library/Frameworks/Adobe AIR.framework/Versions/1.0/Resources/Info.plist"
    
    DownloadUrl = "http://get.adobe.com/air/"

    MinimumVersion = "2.7"
    
    def self.go_to_download_page
      puts "Opening #{DownloadUrl} in your browser"
      Launchy.open DownloadUrl
    end
    
    def self.version
      begin
        body = IO.read InfoPlistFilePath
      rescue
        raise SDKNotFound, <<-EOT.gsub(/ +\|/, '').chomp
          |Could not find Adobe AIR SDK installation. To download/install run:
          |
          |  rake air:download
          |
          |File not found: #{InfoPlistFilePath}
        EOT
      end

      _version = body.scan(/<key>CFBundleVersion<\/key>\s*<string>(.*?)<\/string>/m).flatten.first
      if _version.nil? || _version.length == 0
        raise MissingVersion, <<-EOT.gsub(/ +\|/, '').chomp
          |Found Adobe AIR SDK, but could not find version information in:
          |
          |  #{InfoPlistFilePath}
          |
          |You may need to re-install Adobe AIR. Or if Adobe AIR is installed to
          |a non-standard location you may need to not use this rake task.
        EOT
      end
      _version
    end
    
    def self.print_version
      puts version
    rescue Error => ex
      puts red(ex.message)
    end
    
    def self.print_version_check
      _version = version
      if _version < MinimumVersion
        error = <<-EOT.gsub(/ +\|/, '').chomp
          |You are running an out-of-date version of Adobe AIR SDK:
          |  Minimum required: #{MinimumVersion}
          |  Your version :    #{_version}
          |
          |You can run "rake download:air" to get started installing a new version of AIR.
        EOT
        puts red(error)
      else
        puts green("You're good to go with #{_version}")
      end
    end
    
  end
end