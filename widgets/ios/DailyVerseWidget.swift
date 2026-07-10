import SwiftUI
import WidgetKit

private let suiteName = "group.com.logosai.app.expowidgets"
private let snapshotKey = "DailyVerseWidgetSnapshot"

struct DailyVerseSnapshot: Codable {
  let locale: String
  let reference: String
  let verseText: String
  let themeLabel: String
  let currentDay: Int
  let totalDays: Int
  let hasActivePlan: Bool
  let updatedAt: Double
}

struct DailyVerseEntry: TimelineEntry {
  let date: Date
  let snapshot: DailyVerseSnapshot?
}

struct DailyVerseProvider: TimelineProvider {
  func placeholder(in context: Context) -> DailyVerseEntry {
    DailyVerseEntry(date: Date(), snapshot: DailyVerseSnapshot(
      locale: "en",
      reference: "John 14:27",
      verseText: "Peace I leave with you; my peace I give you.",
      themeLabel: "Peace",
      currentDay: 1,
      totalDays: 7,
      hasActivePlan: true,
      updatedAt: Date().timeIntervalSince1970 * 1000
    ))
  }

  func getSnapshot(in context: Context, completion: @escaping (DailyVerseEntry) -> Void) {
    completion(DailyVerseEntry(date: Date(), snapshot: loadSnapshot()))
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<DailyVerseEntry>) -> Void) {
    let entry = DailyVerseEntry(date: Date(), snapshot: loadSnapshot())
    let nextRefresh = Calendar.current.date(byAdding: .hour, value: 6, to: Date()) ?? Date().addingTimeInterval(21600)
    completion(Timeline(entries: [entry], policy: .after(nextRefresh)))
  }

  private func loadSnapshot() -> DailyVerseSnapshot? {
    guard
      let data = UserDefaults(suiteName: suiteName)?.string(forKey: snapshotKey)?.data(using: .utf8)
    else {
      return nil
    }

    return try? JSONDecoder().decode(DailyVerseSnapshot.self, from: data)
  }
}

struct DailyVerseWidgetView: View {
  @Environment(\.widgetFamily) private var family
  let entry: DailyVerseEntry

  var body: some View {
    Group {
      if let snapshot = entry.snapshot {
        if family == .systemSmall {
          SmallDailyVerseView(snapshot: snapshot)
        } else {
          MediumDailyVerseView(snapshot: snapshot)
        }
      } else {
        EmptyDailyVerseView()
      }
    }
    .widgetURL(URL(string: "logosai://"))
    .dailyVerseWidgetBackground()
  }
}

private struct SmallDailyVerseView: View {
  let snapshot: DailyVerseSnapshot

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(snapshot.locale == "en" ? "Today" : "Hoje")
        .font(.caption2.weight(.semibold))
        .foregroundStyle(Color(red: 0.45, green: 0.39, blue: 0.31))
        .textCase(.uppercase)
      Text(snapshot.reference)
        .font(.headline.weight(.semibold))
        .foregroundStyle(Color(red: 0.11, green: 0.18, blue: 0.29))
        .lineLimit(2)
      Spacer(minLength: 4)
      Text(progressText(snapshot))
        .font(.caption.weight(.medium))
        .foregroundStyle(Color(red: 0.53, green: 0.31, blue: 0.17))
        .lineLimit(1)
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .padding()
  }
}

private struct MediumDailyVerseView: View {
  let snapshot: DailyVerseSnapshot

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      HStack(alignment: .firstTextBaseline) {
        Text(snapshot.reference)
          .font(.caption.weight(.semibold))
          .foregroundStyle(Color(red: 0.53, green: 0.31, blue: 0.17))
        Spacer()
        Text(progressText(snapshot))
          .font(.caption2.weight(.medium))
          .foregroundStyle(Color(red: 0.45, green: 0.39, blue: 0.31))
      }
      Text(snapshot.verseText)
        .font(.system(.body, design: .serif).weight(.medium))
        .foregroundStyle(Color(red: 0.11, green: 0.18, blue: 0.29))
        .lineLimit(3)
        .minimumScaleFactor(0.82)
      Spacer(minLength: 2)
      if !snapshot.themeLabel.isEmpty {
        Text(snapshot.themeLabel)
          .font(.caption.weight(.medium))
          .foregroundStyle(Color(red: 0.45, green: 0.39, blue: 0.31))
          .lineLimit(1)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .padding()
  }
}

private struct EmptyDailyVerseView: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text("Logos AI")
        .font(.headline.weight(.semibold))
        .foregroundStyle(Color(red: 0.11, green: 0.18, blue: 0.29))
      Text("Open the app to prepare your daily verse.")
        .font(.caption)
        .foregroundStyle(Color(red: 0.45, green: 0.39, blue: 0.31))
        .lineLimit(3)
      Spacer()
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
    .padding()
  }
}

private func progressText(_ snapshot: DailyVerseSnapshot) -> String {
  if snapshot.locale == "en" {
    return "Day \(snapshot.currentDay) of \(snapshot.totalDays)"
  }
  return "Dia \(snapshot.currentDay) de \(snapshot.totalDays)"
}

private extension View {
  @ViewBuilder
  func dailyVerseWidgetBackground() -> some View {
    if #available(iOSApplicationExtension 17.0, *) {
      self.containerBackground(for: .widget) {
        Color(red: 0.98, green: 0.96, blue: 0.91)
      }
    } else {
      self.background(Color(red: 0.98, green: 0.96, blue: 0.91))
    }
  }
}

@main
struct DailyVerseWidgetBundle: WidgetBundle {
  var body: some Widget {
    DailyVerseWidget()
  }
}

struct DailyVerseWidget: Widget {
  let kind = "DailyVerseWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: DailyVerseProvider()) { entry in
      DailyVerseWidgetView(entry: entry)
    }
    .configurationDisplayName("Logos AI")
    .description("Daily verse and reading plan progress.")
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}
