module Homebrew
  HomebrewCommand = "brew"
  HomebrewInstallCommand = "brew install"
  CheckForHomebrewCommand = "which #{HomebrewCommand}"
  
  def self.exists?
    `#{CheckForHomebrewCommand}`.length > 0
  end
  
  def self.install(package)
    system "#{HomebrewInstallCommand} #{package}"
  end
end
