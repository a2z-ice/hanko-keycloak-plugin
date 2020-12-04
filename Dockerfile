FROM jboss/keycloak:9.0.3

COPY hanko-plugin-keycloak-ear/target/hanko-plugin-keycloak.ear /opt/jboss/keycloak/standalone/deployments/hanko-plugin-keycloak.ear

