import React from "react";
import { useCreatorStore } from "@/hooks/use-creator-store";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { VideoPreview } from "@/components/Editor/VideoPreview";
import { RightPanel } from "@/components/Editor/RightPanel";
import { Timeline } from "@/components/Editor/Timeline";
import { Dashboard } from "@/components/Views/Dashboard";
import { PostSetup } from "@/components/Views/PostSetup";

export default function Home() {
  const store = useCreatorStore();

  return (
    <div className="flex flex-col h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Hidden file inputs */}
      <input
        type="file"
        accept="video/*"
        ref={store.fileInputRef}
        onChange={store.handleFileUpload}
        className="hidden"
      />
      <input
        type="file"
        accept="audio/*"
        ref={store.audioInputRef}
        onChange={store.handleAudioUpload}
        className="hidden"
      />

      {/* Hidden audio element synced with video */}
      {store.audioSrc && (
        <audio ref={store.audioRef} src={store.audioSrc} preload="auto" />
      )}

      <Header
        projectTitle={store.projectTitle}
        setProjectTitle={store.setProjectTitle}
        exportPanelOpen={store.exportPanelOpen}
        setExportPanelOpen={store.setExportPanelOpen}
        exportPreset={store.exportPreset}
        setExportPreset={store.setExportPreset}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeNav={store.activeNav} setActiveNav={store.setActiveNav} />

        {store.activeNav === "Dashboard" && (
          <Dashboard
            applyTemplate={store.applyTemplate}
            setActiveNav={store.setActiveNav}
            activeTemplateId={store.activeTemplateId}
          />
        )}

        {store.activeNav === "Post Setup" && (
          <PostSetup
            captions={store.captions}
            setCaptions={store.setCaptions}
            hashtags={store.hashtags}
            setHashtags={store.setHashtags}
            videoSrc={store.videoSrc}
          />
        )}

        {store.activeNav !== "Dashboard" && store.activeNav !== "Post Setup" && (
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="flex-1 flex overflow-hidden min-h-0">
              <VideoPreview
                videoSrc={store.videoSrc}
                videoRef={store.videoRef}
                audioRef={store.audioRef}
                audioSrc={store.audioSrc}
                textOverlay={store.textOverlay}
                brightness={store.brightness}
                volume={store.volume}
                playbackSpeed={store.playbackSpeed}
                captions={store.captions}
                transition={store.transition}
                setVideoDuration={store.setVideoDuration}
                triggerUpload={store.triggerUpload}
                removeVideo={store.removeVideo}
              />
              <RightPanel
                textOverlay={store.textOverlay}
                setTextOverlay={store.setTextOverlay}
                captions={store.captions}
                setCaptions={store.setCaptions}
                hashtags={store.hashtags}
                setHashtags={store.setHashtags}
                volume={store.volume}
                setVolume={store.setVolume}
                brightness={store.brightness}
                setBrightness={store.setBrightness}
                playbackSpeed={store.playbackSpeed}
                setPlaybackSpeed={store.setPlaybackSpeed}
                audioSrc={store.audioSrc}
                audioFileName={store.audioFileName}
                triggerAudioUpload={store.triggerAudioUpload}
                removeAudio={store.removeAudio}
                videoSrc={store.videoSrc}
                transition={store.transition}
                setTransition={store.setTransition}
              />
            </div>

            <Timeline
              videoSrc={store.videoSrc}
              videoFileName={store.videoFileName}
              videoDuration={store.videoDuration}
              audioSrc={store.audioSrc}
              audioFileName={store.audioFileName}
              textOverlay={store.textOverlay}
              transition={store.transition}
              triggerUpload={store.triggerUpload}
              triggerAudioUpload={store.triggerAudioUpload}
              removeVideo={store.removeVideo}
              removeAudio={store.removeAudio}
            />
          </div>
        )}
      </div>
    </div>
  );
}
