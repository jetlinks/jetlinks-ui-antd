declare namespace SIMULATOR {
    interface Device {
        id: string,
        name: string,
        description: string,
        networkType: string,
        networkConfiguration: MqttConfig | TcpConfig,
        state: {
            id: string,
            text: string,
        },
        runner: {
            binds: any[],
            total: number,
            startWith: string | number,
            batch: number
        },
        listeners: {
            id: string,
            type: string,
            configuration: any
        }[]
    }

    interface MqttConfig {
        host: string,
        port: string,
        clientId: string,
        username: string,
        password: string,
        keepAliveTimeSeconds: string,
        tls: boolean,
        certId: string,
    }

    interface TcpConfig {
        host: string,
        port: string,
        tls: boolean,
        certId: string,
    }

    interface SimulatorState {
        complete: boolean,
        total: string | number,
        current: string,
        failed: string | number,
        aggTime: {
            max: string | number,
            min: string | number,
            avg: string | number,
        },
        distTime: {
            [string]: string,
        },
        failedTypeCounts: {
            [string]: string,
        },
        runtime: {
            totalUpstream: string | number,
            totalUpstreamBytes: string | number,
            totalDownstream: string | number,
            totalDownstreamBytes: string | number,
        }
    }

    interface Session {
        id: string,
        index: string,
        connected: boolean,
        connectTime: number | string,
    }

}