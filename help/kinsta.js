export function getKinstaHelpMessage() {
  return `\nTemplate file:

# kinsta.yml

sitename: api-lisa.se
staging:
  canonical: staging-lisa-se.kinsta.cloud

  db_name: lisa
  db_password: lisa123
  db_user: lisa

  project_root: /www/example_123/public
  web_user: example
  web_group: www-data
  www_root: /www/example_123/public

  ansible_host: 192.168.0.1
  ansible_ssh_port: 12345

production:
  canonical: lisa-se.kinsta.cloud
  redirects:
    - www.lisa-se.kinsta.cloud

  db_name: lisa
  db_password: lisa123
  db_user: lisa

  project_root: /www/example_123/public
  web_user: example
  web_group: www-data
  www_root: /www/example_123/public

  ansible_host: 192.168.0.1
  ansible_ssh_port: 12345
`
}
