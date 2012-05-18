class Packager
  extend Term::ANSIColor

  OutputFile = "ScoutAppInstaller-#{Scout.version}"
  CertificateFile = File.expand_path("config/scout-app-cert.pfx")
  AirDescriptorFile = "production.xml"
  
  def self.make_certificate!
    if File.exists?(CertificateFile)
      puts red("#{CertificateFile} already exists. Please remove it and re-run.")
      return false
    end

    print "What's the name of your organization? "
    org = STDIN.gets
    
    print "What's do you want your certificate passphrase to be? "
    passphrase = STDIN.gets

    `adt -certificate -cn SelfSign -ou Dev -o "#{org}" -c US 2048-RSA #{CertificateFile} #{passphrase}`
    
    puts green("#{CertificateFile} has been created.")
    true
  end
  
  def self.package_dmg!(output_directory)
    unless File.directory?("config")
      puts red("You must run this from the top-level project directory.")
      return false
    end

    output_file = "#{OutputFile}.dmg"

    puts
    puts "Building #{output_file}"
    puts
    
    puts yellow("**********************************************************************")
    puts yellow("   You will be prompted for your certificate pass-phrase shortly      ")
    puts yellow("**********************************************************************")
    puts
    
    sleep 1
    
    FileUtils.mkdir_p(output_directory)
    
    Rake::Task["build:production"].invoke

    Dir.chdir Scout.build_directory do
      puts Dir.pwd
      now = Time.now
      build_command = "adt -package -storetype pkcs12 -keystore #{CertificateFile} -target native ../#{output_file} #{AirDescriptorFile} ."
      puts build_command
      system build_command
      if $?.exitstatus == 0
        puts green("Done packaging #{output_file} in #{Time.now - now} seconds")
        return true
      else
        puts red("Failed to build #{output_file}")
        return false
      end
    end
  end
  
  def self.package_exe!(output_directory)
    unless File.directory?("config")
      puts red("You must run this from the top-level project directory.")
      return false
    end

    output_file = "#{OutputFile}.exe"

    puts
    puts "Building #{output_file}"
    puts
    
    puts yellow("**********************************************************************")
    puts yellow("   You will be prompted for your certificate pass-phrase shortly      ")
    puts yellow("**********************************************************************")
    puts
    
    sleep 1
    
    FileUtils.mkdir_p(output_directory)
    
    Rake::Task["build:production"].invoke

    Dir.chdir Scout.build_directory do
      puts Dir.pwd
      now = Time.now                       
      build_command = "adt.bat -package -tsa none -storetype pkcs12 -keystore #{CertificateFile} -target native ../#{output_file} #{AirDescriptorFile} ."
      puts build_command
      system build_command
      if $?.exitstatus == 0
        puts green("Done packaging #{output_file} in #{Time.now - now} seconds")
        return true
      else
        puts red("Failed to build #{output_file}")
        return false
      end
    end
  end
  
end

