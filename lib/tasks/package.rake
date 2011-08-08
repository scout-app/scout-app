namespace 'package' do
  desc 'Packages the application as an OSX installer'
  task 'dmg' do
    system "bin/package_app dmg"
  end
  
  desc 'Packages the application as a Windows installer'
  task 'exe' do
    system "bin/package_app exe"
  end
end